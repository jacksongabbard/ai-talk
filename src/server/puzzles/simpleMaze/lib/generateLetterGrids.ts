import Words from 'src/lib/dict/Words';
import { getRandomEntry } from 'src/lib/dict/utils';
import { isLikelyOffensive } from 'src/lib/moderation/bannedWords';
import makeTrie from 'src/lib/trie/Trie';
import { coord } from 'src/server/ui/puzzle/simpleMaze/SimpleMaze';

const dict = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

type CoordGrid = { [x_y: string]: string };
export function generateLetterGrid(size: number): CoordGrid {
  const output: CoordGrid = {};
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      output[coord(x, y)] = getRandomEntry(dict);
    }
  }

  return output;
}

export function hideMessageInGrids(
  grids: { [uuid: string]: CoordGrid },
  message: string,
) {
  const partCount = Object.keys(grids).length;
  const messagePartLengths = Math.floor(message.length / partCount);

  const parts = [];
  let pos = 0;
  for (let i = 0; i < partCount - 1; i++) {
    parts.push(message.substring(pos, pos + messagePartLengths));
    pos += messagePartLengths;
  }
  parts.push(message.substring(pos));

  const uuids = Object.keys(grids);
  for (let i = 0; i < parts.length; i++) {
    const uuid = uuids[i];
    const grid = grids[uuid];
    const part = parts[i];
    const gridLength = Object.keys(grids[uuids[i]]).length;
    const spacing = Math.floor(gridLength / (part.length + 1));
    if (spacing < 1) {
      throw new Error('Grid is too small for supplied message');
    }

    let walker = 0;
    let partPos = 0;
    placement: for (let y = 0; y < Math.sqrt(gridLength); y++) {
      for (let x = 0; x < Math.sqrt(gridLength); x++) {
        if (partPos === part.length) {
          break placement;
        }
        if (walker === spacing) {
          grid[coord(x, y)] = part[partPos];
          partPos++;
          walker = 0;
        } else {
          walker++;
        }
      }
    }
  }
}

export function makeHiddenMessage(): { secretWord: string; pairs: string[][] } {
  const eightLetterWords = Words.filter(
    (w) => w.length === 8 && w.toLowerCase() === w,
  );
  const eightTrie = makeTrie();
  const eightReverseMap: { [sorted: string]: string } = {};
  for (let eight of eightLetterWords) {
    const sorted = eight.split('').sort().join('');
    eightReverseMap[sorted] = eight;
    eightTrie.addWord(sorted);
  }

  const sevenLetterWords = Words.filter(
    (w) => w.length === 7 && w.toLowerCase() === w,
  );

  let randomWord = getRandomEntry(sevenLetterWords);
  while (isLikelyOffensive(randomWord)) {
    console.log(randomWord + 'is likely offensive. Trying again.');
    randomWord = getRandomEntry(sevenLetterWords);
  }

  const randomWordLetters = randomWord.split('');
  const pairs = [];
  sevenLoop: for (let seven of sevenLetterWords) {
    for (let r of randomWordLetters) {
      const sevenPlusOne = (seven + r).split('').sort().join('');
      if (eightTrie.has(sevenPlusOne)) {
        const eight = eightReverseMap[sevenPlusOne];
        if (!isLikelyOffensive(seven) && !isLikelyOffensive(eight)) {
          pairs.push([eight, seven]);
          randomWordLetters.splice(randomWordLetters.indexOf(r), 1);
          continue sevenLoop;
        }
      }
    }
  }

  if (pairs.length < randomWord.length) {
    throw new Error('Could not find words to hide the secret word in');
  }

  return {
    secretWord: randomWord,
    pairs,
  };
}
