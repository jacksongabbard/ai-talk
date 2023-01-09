export function toMorseCodeWords(input: string): string {
  const output = [];
  for (let i = 0; i < input.length; i++) {
    if (input[i] === '.') {
      output.push('dot ');
    } else if (input[i] === '-') {
      output.push('dash ');
    } else {
      output.push(input[i]);
    }
  }
  return output.join('');
}

export function toMorseCodeFromMorseCodeWords(input: string): string {
  const output = [];
  const parts = input.split('\n');
  for (const part of parts) {
    if (part === 'dot') {
      output.push('.');
    } else if (part === 'dash') {
      output.push('-');
    } else {
      output.push(part);
    }
  }
  return output.join('');
}
