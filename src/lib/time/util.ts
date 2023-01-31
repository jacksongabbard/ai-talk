export function leftPad(thing: number | string, padAmount: number): string {
  let str = thing.toString(); // make sure it's a string
  const zeroCount = padAmount - str.length;
  for (let ii = 0; ii < zeroCount; ii++) {
    str = '0' + str;
  }

  return str;
}

export function convertSecondsToTime(
  seconds: number,
  secondSeparator: string,
  significantDigitsInMilliseconds = 3,
): string {
  const hrs = leftPad(Math.floor(seconds / (60 * 60)), 2);
  const mins = leftPad(Math.floor(seconds / 60) % 60, 2);
  const secs = leftPad(Math.floor(seconds) % 60, 2);
  const ms = leftPad(
    Math.round((seconds % 1) * Math.pow(10, significantDigitsInMilliseconds)),
    significantDigitsInMilliseconds,
  );
  return `${hrs}:${mins}:${secs}${secondSeparator}${ms}`;
}
