import { toReverse } from './reverse';

test('reversing works', () => {
  const str = '1 2\na. abracadra';
  const reverse = toReverse(str);
  const correctReverse = 'ardacarba .a\n2 1';
  expect(reverse).toStrictEqual(correctReverse);
});
