import { decryptBase, encryptBase } from './cryptoBase';

const DUMMY_KEY = 'foo bar baz qux';

(() => {
  const messageObject = { message: 'This is a test message.' };

  let ciphertext = '';
  let plaintext = '';
  test('encrypting a message succeeds', () => {
    ciphertext = encryptBase(ciphertext, DUMMY_KEY);
    expect(ciphertext).toBeTruthy();
    expect(ciphertext.length).toBeGreaterThan(0);
  });

  test('decrypting a message succeeds', () => {
    plaintext = decryptBase(ciphertext, DUMMY_KEY);
    expect(plaintext).toBeTruthy();
    expect(plaintext.length).toBeGreaterThan(0);
  });

  test('plaintext and ciphertext are not equal', () => {
    expect(plaintext).not.toStrictEqual(ciphertext);
  });

  test('plaintext contains preserved JSON', () => {
    const resaturated = JSON.parse(plaintext);
    expect(resaturated).toBeTruthy();
    expect(resaturated.message).toBeTruthy();
    expect(resaturated.message).toStrictEqual(messageObject.message);
    expect(Object.keys(resaturated).length).toStrictEqual(1);
  });
})();
