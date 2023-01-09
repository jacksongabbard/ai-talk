import { toAtbash, fromAtbash } from './atbash';

test('converting to atbash', () => {
  const str = '1 2\na. -- abracadabra';
  const atbash = toAtbash(str);
  const correctAtbash = '8 7\nz. -- zyizxzwzyiz';
  // console.log(JSON.stringify({ str, atbash, correctAtbash }, null, 4));
  expect(atbash).toStrictEqual(correctAtbash);
});

test('converting from atbash back to chars works', () => {
  const str = 'ulfi: hxliv; zmw hvevm\nbvzih ztl 876';
  const charString = fromAtbash(str);
  const correctString = 'four: score; and seven\nyears ago 123';
  expect(charString).toStrictEqual(correctString);
});

test('converting to atbash and back works', () => {
  const str = '1 v; occult: yakitori- . 8 0  2\nfooo';
  const original = fromAtbash(toAtbash(str));
  expect(original).toStrictEqual(str);
});
