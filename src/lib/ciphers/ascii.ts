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
  for (const part of parts) {
    output.push(String.fromCharCode(parseInt(part, 10)));
  }
  return output.join('');
}
