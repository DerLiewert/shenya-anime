import { useState } from 'react';

export const useShowMoreMap = (step = 10) => {
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>({});

  const init = (keys: string[]) => {
    const initialCounts: Record<string, number> = {};

    keys.forEach((key) => {
      initialCounts[key] = step;
    });

    setVisibleCounts(initialCounts);
  };

  const reset = (keys: string[] = []) => {
    const resetCounts: Record<string, number> = { ...visibleCounts };

    if (keys.length === 0) {
      for (const key in resetCounts) {
        resetCounts[key] = step;
      }
    } else {
      keys.forEach((key) => {
        resetCounts[key] = step;
      });
    }

    setVisibleCounts(resetCounts);
  };

  const showMore = (key: string) => {
    setVisibleCounts((prev) => ({ ...prev, [key]: prev[key] + step }));
  };

  return { visibleCounts, init, reset, showMore };
};
