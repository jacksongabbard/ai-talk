import { getRandomEntry } from 'src/lib/dict/utils';

// Intentionally excluding one here because multiplying by one
// is lame.
const getRandomSingelDigitNumberGreaterThanZero = (): number => {
  return Math.round(Math.random() * 7) + 2;
};

export const createOnionGrinderPayloads = () => {
  let runningTotal = 100000 + Math.round(Math.random() * 100000);
  const mathProblem: (string | number)[] = [runningTotal];
  const ops = ['*', '+', '-'];
  for (let i = 0; i < 6; i++) {
    const op = getRandomEntry(ops);
    const num = getRandomSingelDigitNumberGreaterThanZero();
    mathProblem.unshift('(');
    mathProblem.push(op);
    mathProblem.push(num);
    mathProblem.push(')');

    switch (op) {
      case '*':
        runningTotal *= num;
        break;
      case '+':
        runningTotal += num;
        break;
      case '-':
        runningTotal -= num;
        break;
    }
  }

  console.log(mathProblem.join(''));
  console.log(runningTotal);

  const puzzlePayload = {};
  const solutionPayload = {};
  return {
    puzzlePayload,
    solutionPayload,
  };
};
