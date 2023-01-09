import { toWords, fromWords } from './words';

test('converting to chars to words works', () => {
  const str = '1 2\na.';
  const words = toWords(str);
  expect(words).toStrictEqual('one space two return eh period');
});

test('converting from words back to chars works', () => {
  const str =
    'eff oh oh period return BEE eh are space hyphen hyphen bee eeee ZED';
  const charString = fromWords(str);
  const correctString = 'foo.\nBar --beZ';
  expect(charString).toStrictEqual(correctString);
});

test('converting to words and back works', () => {
  const str = '1 v occult YAKITORI- . 8 0  2\nfooo';
  const original = fromWords(toWords(str));
  expect(original).toStrictEqual(str);
});
