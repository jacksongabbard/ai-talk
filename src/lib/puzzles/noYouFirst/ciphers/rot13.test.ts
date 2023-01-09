import { toRot13, fromRot13 } from './rot13';

test('converting to chars to rot13 works', () => {
  const str = '1 2\na.';
  const rot13 = toRot13(str);
  const correctRot13 = '6-7\nn;';
  expect(rot13).toStrictEqual(correctRot13);
});

test('converting from rot13 words back to chars works', () => {
  const str = 'svefg-9-:-2\nsynvy;';
  const charString = fromRot13(str);
  const correctString = 'first 4 - 7\nflail.';
  expect(charString).toStrictEqual(correctString);
});

test('converting to rot13 and back works', () => {
  const str = '1 v occult yakitori- . 8 0  2\nfooo';
  const original = fromRot13(toRot13(str));
  expect(original).toStrictEqual(str);
});
