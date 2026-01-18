import { scrollToTop } from '@/utils';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageScrollToTop = (deps: React.DependencyList = []) => {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, deps);
};

export const useTabsPageScrollToTop = (
  tabsRef: React.RefObject<HTMLElement | null>,
  deps: React.DependencyList = [],
) => {
  const location = useLocation();

  usePageScrollToTop(deps);

  useEffect(() => {
    if (tabsRef.current) {
      scrollToTop(tabsRef);
    }
  }, [location.pathname]);
};
