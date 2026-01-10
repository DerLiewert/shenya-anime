import { scrollToTop } from '@/utils';
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

export const AppLayout = () => {
  const location = useLocation();
  const scrollTargetRef = React.useRef<HTMLElement | null>(null);

  const setScrollTarget = React.useCallback((el: HTMLElement | null) => {
    scrollTargetRef.current = el;
  }, []);

  React.useEffect(() => {
    if (scrollTargetRef.current) {
      scrollToTop(scrollTargetRef);
    } else {
      window.scrollTo({ top: 0 });
    }
  }, [location.pathname]);

  return <Outlet context={{ setScrollTarget }} />;
};
