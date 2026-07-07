// array
export const MOCK_LIMIT = 20;
export const MOCK_LOAD_DELAY = 200;
export const mock_array = <T>(func: (index: number) => T, length?: number) => {
  const _length = length || MOCK_LIMIT;
  return Array.from(Array(_length)).map((_, i) => func(i));
};
