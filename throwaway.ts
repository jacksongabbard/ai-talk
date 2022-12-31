import Words from './src/lib/dict/Words';
import { isLikelyOffensive } from './src/lib/moderation/bannedWords';

/*
for (let word of Words) {
  if (isLikelyOffensive(word)) {
    console.log(word);
  }
}
*/

console.log({ offensive: isLikelyOffensive('c_ockfighter') });
