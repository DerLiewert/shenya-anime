import { useState } from 'react';

export const useShowMore = (step = 10) => {
  const [visibleCount, setVisibleCount] = useState(step);
  const showMore = () => setVisibleCount((prev) => prev + step);
  const reset = () => setVisibleCount(step);
  return { visibleCount, showMore, reset };
};

// function useShowMore(initialCount: number, resetKey: string | number) {
//   const [visibleCount, setVisibleCount] = useState(initialCount);

//   useEffect(() => {
//     setVisibleCount(initialCount); // сброс при смене ключа
//   }, [resetKey]);

//   const showMore = () => setVisibleCount((prev) => prev + initialCount);

//   return { visibleCount, showMore };
// }