import { useState } from 'react';

type VisibleCountsMap = Record<string, number>;

export const useShowMoreMap = (step: number = 10) => {
  const [visibleCountsMap, setVisibleCountsMap] = useState<VisibleCountsMap>({});

  const initShowMore = (keys: string[]) => {
    const initialCounts: VisibleCountsMap = {};

    keys.forEach((key) => {
      initialCounts[key] = step;
    });

    setVisibleCountsMap(initialCounts);
  };

  const reset = (keys: string[] = []) => {
    const resetCounts: VisibleCountsMap = { ...visibleCountsMap };

    if (keys.length === 0) {
      for (const key in resetCounts) {
        resetCounts[key] = step;
      }
    } else {
      keys.forEach((key) => {
        resetCounts[key] = step;
      });
    }

    setVisibleCountsMap(resetCounts);
  };

  const showMore = (key: string) => {
    setVisibleCountsMap((prev) => ({ ...prev, [key]: prev[key] + step }));
  };

  return { visibleCountsMap, initShowMore, reset, showMore };
};
