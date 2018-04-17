export default function lazy<T>(fn: () => T): () => T {
  let memoized: T;

  return function() {
    return memoized === undefined ? (memoized = fn()) : memoized;
  };
}
