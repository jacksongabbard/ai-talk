const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .-';

const table: { [c: string]: string }  = {};
const reverseTable: { [c: string]: string } = {};

for (let c of chars) {
  table[c] = c.charCodeAt(0).toString();
  reverseTable[c.charCodeAt(0).toString()] = c;
}

console.log(JSON.stringify(table, null, 4));
console.log(JSON.stringify(reverseTable, null, 4));




