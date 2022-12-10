const values: string[] = [];

// Populate an array with every printable ASCII character
for (let ii = 33; ii <= 126; ii++) {
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
