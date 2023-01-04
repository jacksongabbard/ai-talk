import { merge } from 'lodash';

const a = { a: { b: { c: 'foo' } } };
const b = { a: { b: { d: 'bar' } } };

console.log(merge(a, b));
