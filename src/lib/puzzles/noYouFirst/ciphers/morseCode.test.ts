import { toMorseCode, fromMorseCode } from './morseCode';

test('converting to chars to words works', () => {
  const str = '1 2\na. -- abracadabra';
  const morseCode = toMorseCode(str);
  const correctCode =
    '.---- ..--.- ..--- \n .- .-.-.- ..--.- -....- -....- ..--.- .- -... .-. .- -.-. .- -.. .- -... .-. .-';
  console.log(JSON.stringify({ str, morseCode, correctCode }, null, 4));
  expect(morseCode).toStrictEqual(correctCode);
});

test('converting from morsed code back to chars works', () => {
  const str =
    '--.- ..- -..- ..--.- .---- \n ..--- ...-- ..--.- .-.-.- ..--.- -....- ..--.- ----- ----. ..--.- .-- .- .- .- .- -';
  const charString = fromMorseCode(str);
  const correctString = 'qux 1\n23 . - 09 waaaat';
  expect(charString).toStrictEqual(correctString);
});

test('converting to morse code and back works', () => {
  const str = '1 v occult YAKITORI- . 8 0  2\nfooo';
  const original = fromMorseCode(toMorseCode(str));
  expect(original).toStrictEqual(str);
});
