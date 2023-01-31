export function toReverse(input: string): string {
  const output = [];
  for (let i = input.length - 1; i >= 0; i--) {
    output.push(input[i]);
  }
  return output.join('');
}
