import { toNatoWords, fromNatoWords } from './nato';

test('converting to chars to nato works', () => {
  const str = '1 2\na.';
  const nato = toNatoWords(str);
  const correctNato = 'wun space two return alpha stop';
  expect(nato).toStrictEqual(correctNato);
});

test('converting from nato words back to chars works', () => {
  const str =
    'november echo victor echo romeo space hyphen hyphen space stop wun niner return bravo';
  const charString = fromNatoWords(str);
  const correctString = 'never -- .19\nb';
  expect(charString).toStrictEqual(correctString);
});

test('converting to words and back works', () => {
  const str = '1 v occult yakitori- . 8 0  2\nfooo';
  const original = fromNatoWords(toNatoWords(str));
  expect(original).toStrictEqual(str);
});
