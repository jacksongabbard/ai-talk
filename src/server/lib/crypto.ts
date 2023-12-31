import type { JSONValue } from '../../lib/typeUtilities';

import { encryptBase, decryptBase } from '../../lib/cryptoBase';
import getDotEnv from '../../lib/dotenv';

// This file exists to bind the dotenv config to useful crypto functions.
// All the goodies are in cryptoBase.ts. They are separated to make unit
// testing the base crypto functions easier (i.e. not reliant on
// environmental configuration).

const { AES_KEY } = getDotEnv();

export function decrypt(encryptedString: string, arbitraryStringKey?: string) {
  return decryptBase(encryptedString, arbitraryStringKey || AES_KEY);
}

export function encrypt(dataObject: JSONValue, arbitraryStringKey?: string) {
  return encryptBase(dataObject, arbitraryStringKey || AES_KEY);
}
