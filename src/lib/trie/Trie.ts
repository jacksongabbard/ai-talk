const isFinalLetter = Symbol('isFinalLetter');

export type Trie = {
  addWord: (word: string) => void;
  has: (word: string) => boolean;
};
export type TrieNode = {
  [letter: string]: TrieNode;
  [isFinalLetter]?: boolean;
};

const addWord = (node: TrieNode, letters: string) => {
  let n = node;
  let l: string;
  for (let ii = 0; ii < letters.length; ii++) {
    l = letters[ii];
    if (!n[l]) {
      n[l] = {};
    }
    n = n[l];
  }
  n[isFinalLetter] = true;
};

const has = (node: TrieNode, letters: string) => {
  let n = node;
  for (let ii = 0; ii < letters.length; ii++) {
    const l = letters[ii];
    if (!n[l]) {
      return false;
    }
    n = n[l];
  }
  if (!n[isFinalLetter]) {
    return false;
  }
  return true;
};

export default function makeTrie(): Trie {
  const root = {};
  const _addWord = (word: string) => {
    addWord(root, word);
  };

  const _has = (word: string) => {
    return has(root, word);
  };
  return {
    addWord: _addWord,
    has: _has,
  };
}
