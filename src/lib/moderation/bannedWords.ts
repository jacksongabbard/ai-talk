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
  'abo',
  'arse',
  'arsehead',
  'ass',
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
  'honky',
  'jew',
  'jigaboo',
  'jiggaboo',
  'jizz',
  'kike',
  'kyke',
  'kyke',
  'monkey',
  'nazi',
  'negro',
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
  'slut',
  'spade',
  'spastic',
  'spearchucker',
  'sperg',
  'spic',
  'spic',
  'spick',
  'spik',
  'spig',
  'spigotty',
  'spook',
  'tarbaby',
  'tit',
  'titties',
  'boobs',
  'boob',
  'twat',
  'uncletom',
  'vagina',
  'wanker',
  'wap',
  'wetback',
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

export function isLikelyOffensive(n: string): boolean {
  if (trie.has(n)) {
    return true;
  }

  if (n.includes('_') || n.includes('-')) {
    if (trie.has(n.replace(/_-/g, ''))) {
      return true;
    }

    const dashSeparatedParts = n.split('-');
    for (let part of dashSeparatedParts) {
      if (trie.has(part)) {
        return true;
      }
    }

    const underscoreSeparatedParts = n.split('_');
    for (let part of underscoreSeparatedParts) {
      if (trie.has(part)) {
        return true;
      }
    }

    const eitherSeparator = n.split(/_-/);
    for (let part of eitherSeparator) {
      if (trie.has(part)) {
        return true;
      }
    }

    // There's so much more to do here, but this is more than zero
  }

  return false;
}
