import { isLikelyOffensive } from './bannedWords';

(() => {
  const badWordList = [
    'fuck',
    'fuckfuckfuck',
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
    'xx_fuck_xx',
    'assASSassASS',
    'bearNegro',
    'c_ock_and_b_alls',
  ];

  const safeWordList = ['jewel', 'class', 'assassin'];

  for (const word of badWordList) {
    test(word + ' is offensive', () => {
      expect(isLikelyOffensive(word)).toBe(true);
    });
  }

  for (const word of safeWordList) {
    test(word + ' is not offensive', () => {
      expect(isLikelyOffensive(word)).toBe(false);
    });
  }
})();
