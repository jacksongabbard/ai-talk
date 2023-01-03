export function getRandomEntry(dict: string[]): string {
  const randomIdx = Math.round(Math.random() * dict.length - 1);
  return dict[randomIdx];
}
