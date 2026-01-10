import React from 'react';
import { useOutletContext } from 'react-router-dom';

type ScrollContext = {
  setScrollTarget: (el: HTMLElement | null) => void;
};

export const useScrollTarget = (ref: React.RefObject<HTMLElement | null>) => {
  const outlet = useOutletContext<ScrollContext | null>();
  React.useEffect(() => {
    if (ref) outlet?.setScrollTarget(ref.current);
    return () => outlet?.setScrollTarget(null);
  }, [outlet, ref]);
};
