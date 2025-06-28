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

// type BreakpointState = {
//   [key: string]: boolean;
// };

// export const useMatchMedia2 = (
//   breakpoints: { name: string; type: 'min' | 'max'; width: number }[],
// ) => {
//   const queryList = breakpoints.map(
//     ({ type, width }) => `(${type}-width: ${type === 'max' ? width - 0.02 : width}px)`,
//   );

//   const getMatch = () =>
//     breakpoints.reduce((acc, bp) => {
//       const query = `(${bp.type}-width: ${bp.type === 'max' ? bp.width - 0.02 : bp.width}px)`;
//       acc[bp.name] = matchMedia(query).matches;
//       return acc;
//     }, {} as BreakpointState);

//   const [matchesList, setMatchesList] = useState<BreakpointState>(getMatch);
//   console.log('matchesList', matchesList);

//   // const query = `(${name}-width: ${name === 'max' ? width - 0.02 : width}px)`;
//   // const [matches, setMatches] = useState(matchMedia(query).matches);

//   // useEffect(() => {
//   //   const mediaQuery = matchMedia(query);
//   //   const listener = (event: MediaQueryListEvent) => setMatches(event.matches);

//   //   mediaQuery.addEventListener('change', listener);
//   //   setMatches(mediaQuery.matches);

//   //   return () => {
//   //     mediaQuery.removeEventListener('change', listener);
//   //   };
//   // }, [query]);

//   // return matches;
// };
