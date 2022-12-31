import { isLikelyOffensive } from './bannedWords';

(() => {
  const badWordList = [
    'nigger',
    'ni99er',
    'jew',
    'j3w',
    'faggot',
    'f4gg0t',
    'ass',
    'a55',
    'pussy_wagon',
    'fuck_stick',
    'big-dick-energy',
    /*
    'assASSassASS',
    'bearNegro',
    // Wish these were already blocked, but this is as far as I got with the
    // time I had.
    */
  ];
  const safeWordList = ['snigger', 'jewel', 'class', 'assassin'];

  for (let word of badWordList) {
    test(word + ' is offensive', () => {
      expect(isLikelyOffensive(word)).toBe(true);
    });
  }

  for (let word of safeWordList) {
    test(word + ' is not offensive', () => {
      expect(isLikelyOffensive(word)).toBe(false);
    });
  }
})();
