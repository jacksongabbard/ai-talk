type DiffObject = {
  seq: number;
  value: object;
};

export type ActionResult = {
  diff: DiffObject;
  state: object;
};
