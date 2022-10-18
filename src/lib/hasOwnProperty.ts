// This function determines if X has property Y and does so in a
// a way that preserves the type information within TypeScript.
export function hasOwnProperty<X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y,
): obj is X & Record<Y, unknown> {
  return obj.hasOwnProperty(prop);
}
