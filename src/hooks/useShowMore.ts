import { useState } from 'react';

export const useShowMore = (step = 10) => {
  const [visibleCount, setVisibleCount] = useState(step);
  const showMore = () => setVisibleCount((prev) => prev + step);
  const reset = () => setVisibleCount(step);
  return { visibleCount, showMore, reset };
};

