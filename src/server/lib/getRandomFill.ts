const values: string[] = [];

// 0-9,A-Z, and a-z
for (let ii = 48; ii <= 57; ii++) {
  const s: string = String.fromCharCode(ii);
  values.push(s);
}
for (let ii = 65; ii <= 90; ii++) {
  const s: string = String.fromCharCode(ii);
  values.push(s);
}
for (let ii = 97; ii <= 122; ii++) {
  const s: string = String.fromCharCode(ii);
  values.push(s);
}

function getRandomFill(charCount: number) {
  const output = [];
  for (let ii = 0; ii < charCount; ii++) {
    const idx = Math.floor(Math.random() * values.length);
    output.push(values[idx]);
  }
  return output.join('');
}

export default getRandomFill;
