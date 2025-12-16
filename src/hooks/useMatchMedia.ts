import { useEffect, useState } from 'react';

export const useMatchMedia = (name: 'min' | 'max', width: number) => {
  const query = `(${name}-width: ${name === 'max' ? width - 0.02 : width}px)`;
  const [matches, setMatches] = useState(matchMedia(query).matches);

  useEffect(() => {
    const mediaQuery = matchMedia(query);
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);

    mediaQuery.addEventListener('change', listener);
    setMatches(mediaQuery.matches);

    return () => {
      mediaQuery.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
};
