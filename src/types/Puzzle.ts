export type PuzzleInstanceData = {
  puzzlePayload: object;
  solutionPayload: object;
};

export type Puzzle = {
  name: string;
  slug: string;
  createInstance: () => PuzzleInstanceData;
  receiveAction: (action: object) => void;
};
