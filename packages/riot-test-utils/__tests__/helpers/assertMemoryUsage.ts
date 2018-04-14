declare var process: any;

function getMemoryUsage() {
  return process.memoryUsage().heapUsed;
}

/**
 * assert increase of memory
 *
 * @param limit limit memory usage
 * @param callback execution callback
 */
export default function assertMemoryUsage(limit: number, callback: () => void) {
  const before = getMemoryUsage();
  callback();
  const increase = getMemoryUsage() - before;
  expect(increase).toBeLessThan(limit);
}
