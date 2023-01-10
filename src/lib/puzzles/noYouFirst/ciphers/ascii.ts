export function toAscii(input: string): string {
  const output = [];
  for (let i = 0; i < input.length; i++) {
    output.push(input.charCodeAt(i));
  }
  return output.join(' ');
}

const nullValue = String.fromCharCode(0);
export function fromAscii(input: string): string {
  const output = [];
  const parts = input.split(' ');
  for (const part of parts) {
    const integerMaybe = parseInt(part, 10);
    if (isNaN(integerMaybe)) {
      output.push('NaN');
    } else if (String.fromCharCode(integerMaybe) === nullValue) {
      output.push(part);
    } else {
      output.push(String.fromCharCode(integerMaybe));
    }
  }
  return output.join('');
}
