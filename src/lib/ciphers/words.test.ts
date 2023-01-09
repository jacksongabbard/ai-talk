import { toNumberWords, fromNumberWords } from './words';

test('converting to number words works', () => {
  const str = '123\n456 789';
  const numberWords = toNumberWords(str);
  expect(numberWords).toStrictEqual('one two three\nfour five six  789');
});

test('converting from ascii back to chars works', () => {
  const str = '70 111 111 32 66 97 114 32 10 66 97 122 32 46 45 32 49 55';
  const charString = fromAscii(str);
  expect(charString).toStrictEqual('Foo Bar \nBaz .- 17');
});

test('converting to ascii and back works', () => {
  const str = '1 v - . 8 0  2\nfooo';
  const original = fromAscii(toAscii(str));
  expect(original).toStrictEqual(str);
});
