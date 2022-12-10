import { encrypt } from './crypto';
import getRandomFill from './getRandomFill';

// Where did I leave off?
// This is dumb. I should just put this in the DB.
const dtsgKeySize = 12;
function makeDTSG(): string {
  const dtsgKey = getRandomFill(dtsgKeySize);
  const dtsgKeyCipherText = encrypt({ dtsgKey });
  const dtsgValueCipherText = encrypt({ ts: Date.now() }, dtsgKey);

  return `${dtsgKeyCipherText}${dtsgValueCipherText}`;
}
