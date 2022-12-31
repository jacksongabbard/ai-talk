import makeTrie, { Trie } from '../trie/Trie';

const subtitutionMap: { [letter: string]: string[] } = {
  a: ['4'],
  e: ['3'],
  g: ['6', '9'],
  i: ['1'],
  l: ['1'],
  s: ['5'],
  t: ['7'],
  ck: ['kk'],
  o: ['0'],
  z: ['2'],
};

const base = [
  'abbo',
  // 'abo', -- too many false positives
  'arsehead',
  // 'ass', -- waaay too many false positives
  'assbag',
  'assface',
  'asshat',
  'asshole',
  'bastard',
  'beaner',
  'bitch',
  'blackie',
  'blacky',
  'blowjob',
  'cameljockey',
  'chink',
  'clit',
  'cock',
  'coon',
  'cracker',
  'cum',
  'cunt',
  'darkie',
  'darky',
  'dick',
  'dildo',
  'dyke',
  'fag',
  'faggot',
  'fuck',
  'gipp',
  'gippo',
  'golliwog',
  'gook',
  'gypo',
  'gyppie',
  'gyppo',
  'gyppy',
  'hooker',
  'honky',
  'hitler',
  // 'jew', -- too many false positives
  'jigaboo',
  'jiggaboo',
  'jizz',
  'kike',
  'kyke',
  'kyke',
  'monkey',
  'nazi',
  'negro',
  // 'nig', -- too many false positives
  'nigg',
  'nigga',
  'nigger',
  'niglet',
  'nigra',
  'paki',
  'pakki',
  'peckerwood',
  'penis',
  'pickaninny',
  'polack',
  'polak',
  'polock',
  'prick',
  'pussy',
  'puta',
  'queef',
  'raghead',
  'redskin',
  'roundeye',
  'sambo',
  'schlampe',
  'semen',
  'sharmuta',
  'sharmute',
  'sheepshagger',
  'shit',
  'shite',
  'shylock',
  'skank',
  'slapper',
  'slut',
  'spade',
  'spastic',
  'spearchucker',
  'sperg',
  // 'spic', -- too many false positives
  'spick',
  'spik',
  'spig',
  'spigotty',
  'spook',
  'tarbaby',
  // 'tit', -- too many false positives
  'titties',
  'boobs',
  'boob',
  'twat',
  'uncletom',
  'vagina',
  'wanker',
  // 'wap', -- too many false positives
  'wetback',
  'whitepower',
  'whore',
  'wigger',
  'wigga',
  'wop',
];

const trie = makeTrie();

const addVariants = (trie: Trie, word: string) => {
  for (let letter in subtitutionMap) {
    if (word.includes(letter)) {
      for (let sub of subtitutionMap[letter]) {
        const newWord = word.replace(letter, sub);
        trie.addWord(newWord);
        addVariants(trie, newWord);
      }
    }
  }
};

for (let word of base) {
  trie.addWord(word);
  addVariants(trie, word);
}

export function isLikelyOffensive(word: string): boolean {
  if (word.length <= 2) {
    return false;
  }

  const candidates = new Set<string>();

  for (let i = 0; i < word.length - 2; i++) {
    for (let k = i + 3; k <= word.length; k++) {
      const subword = word.substring(i, k).toLowerCase();
      if (!subword.includes('_') && !subword.includes('-')) {
        candidates.add(subword);
      } else {
        candidates.add(subword.replace(/[_-]/g, ''));

        const dashSeparatedParts = subword.split('-');
        for (let part of dashSeparatedParts) {
          candidates.add(part);
        }

        const underscoreSeparatedParts = subword.split('_');
        for (let part of underscoreSeparatedParts) {
          candidates.add(part);
        }

        const eitherSeparator = subword.split(/[_-]/g);
        for (let part of eitherSeparator) {
          candidates.add(part);
        }

        // There's so much more to do here, but this is more than zero
      }
    }
  }

  console.log(Array.from(candidates));

  for (let w of Array.from(candidates)) {
    if (trie.has(w)) {
      return true;
    }
  }

  return false;
}
