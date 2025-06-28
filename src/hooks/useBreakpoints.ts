import { throttle } from '@/utils/throttle';
import { useEffect, useState } from 'react';

type Breakpoint = {
  name: string;
  maxWidth: number;
};

type BreakpointState = {
  [key: string]: boolean;
};

export const useBreakpoints = (breakpoints: Breakpoint[], throttleDelay = 100): BreakpointState => {
  const getMatch = () =>
    breakpoints.reduce((acc, bp) => {
      acc[bp.name] = window.innerWidth < bp.maxWidth;
      return acc;
    }, {} as BreakpointState);

  const [matches, setMatches] = useState<BreakpointState>(getMatch);

  useEffect(() => {
    const handleResize = throttle(() => setMatches(getMatch()), throttleDelay);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return matches;
};
