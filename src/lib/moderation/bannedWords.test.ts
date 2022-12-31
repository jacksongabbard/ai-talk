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
