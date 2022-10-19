import crypto from 'crypto';

import type { JSONValue } from './typeUtilities';

const nonceSize = 12;
const gcmTagSize = 16;

function makeRandomBuffer(len: number) {
  const b = Buffer.alloc(len);
  for (let ii = 0; ii < len; ii++) {
    b[ii] = Math.round(Math.random() * 0xff);
  }
  return b;
}

function getHash(str: string) {
  return crypto.createHash('sha256').update(str).digest();
}

export function decryptBase(
  encryptedString: string,
  arbitraryStringKey: string,
) {
  const decoded = Buffer.from(encryptedString, 'base64');
  const nonce = decoded.subarray(0, nonceSize);
  const ciphertext = decoded.subarray(
    nonceSize,
    nonceSize + (decoded.length - gcmTagSize),
  );
  const tag = decoded.subarray(nonceSize + (decoded.length - gcmTagSize));
  const key = getHash(arbitraryStringKey);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, nonce);
  decipher.setAuthTag(tag);
  let plaintext = '!!if you see this text in output, something went wrong!!';
  try {
    plaintext = decipher.update(ciphertext).toString();
    plaintext += decipher.final('utf8');
    return JSON.parse(plaintext);
  } catch (ex) {
    console.log(ex);
    throw new Error('Failed to decipher sealed message');
  }
}

export function encryptBase(
  dataObject: JSONValue, 
  arbitraryStringKey: string
) {
  const jsonString = JSON.stringify(dataObject);
  const nonce = makeRandomBuffer(nonceSize);
  let key = getHash(arbitraryStringKey);
  const encipher = crypto.createCipheriv('aes-256-gcm', key, nonce);
  let dataCiphertext: string;
  let dataCiphertextBuffer: Buffer;
  let tag: Buffer;
  try {
    dataCiphertext = encipher.update(jsonString, 'utf8', 'hex');
    dataCiphertext += encipher.final('hex');
    console.log({ jsonString, dataCiphertext });
    dataCiphertextBuffer = Buffer.from(dataCiphertext, 'hex');
    tag = encipher.getAuthTag();
  } catch (ex) {
    console.log('Failed to encrypt message', ex);
    throw new Error('Failed to encrypt message');
  }

  console.log('nonce: ' + nonce.toString('hex'));
  console.log('cipher: ' + dataCiphertextBuffer.toString('hex'));
  console.log('tag: ' + tag.toString('hex'));

  return Buffer.concat([nonce, dataCiphertextBuffer, tag]).toString('base64');
}
