export function toAscii(input: string): string {
  const output = [];
  for (let i = 0; i < input.length; i++) {
    output.push(input.charCodeAt(i));
  }
  return output.join(' ');
}

export function fromAscii(input: string): string {
  const output = [];
  const parts = input.split(' ');
  try {
    for (const part of parts) {
      const integerMaybe = parseInt(part, 10);
      if (integerMaybe === undefined || integerMaybe < 10) {
        output.push('!');
      } else {
        output.push(String.fromCharCode(integerMaybe));
      }
    }
  } catch (e) {
    output.push('Error: That was definitely the wrong order.');
  }
  return output.join('');
}
