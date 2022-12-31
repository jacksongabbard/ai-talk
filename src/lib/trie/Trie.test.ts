import makeTrie from './Trie';

(() => {
  const wordList = ['foo', 'bar', 'baz'];

  const t = makeTrie();
  wordList.forEach((w) => {
    t.addWord(w);
  });

  test('words that should be there are there', () => {
    expect(t.has('foo')).toBe(true);
    expect(t.has('bar')).toBe(true);
    expect(t.has('baz')).toBe(true);
  });

  test("words that should not be there, aren't", () => {
    expect(t.has('food')).toBe(false);
    expect(t.has('barn')).toBe(false);
    expect(t.has('bazel')).toBe(false);
  });

  test('partial matches fail', () => {
    expect(t.has('fo')).toBe(false);
    expect(t.has('ba')).toBe(false);
  });
})();
