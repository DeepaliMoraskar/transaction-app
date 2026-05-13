import { describe, expect, it } from 'vitest';

async function runWithLimit<T, R>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<R>
): Promise<R[]> {
  const results = new Array<R>(items.length);
  const iterator = items.entries();

  const runner = async () => {
    for (const [index, item] of iterator) {
      results[index] = await worker(item);
    }
  };

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, runner)
  );
  return results;
}

describe('runWithLimit', () => {
  it('processes all items and returns results in order', async () => {
    const results = await runWithLimit([1, 2, 3], 3, async (x) => x * 2);
    expect(results).toEqual([2, 4, 6]);
  });

  it('returns empty array for empty input', async () => {
    const results = await runWithLimit([], 3, async (x) => x);
    expect(results).toEqual([]);
  });

  it('respects concurrency limit', async () => {
    let concurrent = 0;
    let maxConcurrent = 0;

    await runWithLimit([1, 2, 3, 4, 5], 2, async (x) => {
      concurrent++;
      maxConcurrent = Math.max(maxConcurrent, concurrent);
      await new Promise<void>(resolve => setTimeout(resolve, 10));
      concurrent--;
      return x;
    });

    expect(maxConcurrent).toBeLessThanOrEqual(2);
  });

  it('processes sequentially with limit of 1', async () => {
    const order: number[] = [];
    await runWithLimit([1, 2, 3], 1, async (x) => {
      order.push(x);
      return x;
    });
    expect(order).toEqual([1, 2, 3]);
  });

  it('works when limit exceeds item count', async () => {
    const results = await runWithLimit([10, 20], 100, async (x) => x + 1);
    expect(results).toEqual([11, 21]);
  });
});
