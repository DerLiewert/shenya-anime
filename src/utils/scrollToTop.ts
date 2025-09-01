export const scrollToTop = (cardsRef: React.RefObject<HTMLElement | null>, smooth: boolean = false) => {
  if (!cardsRef.current) return;

  const tabsTop = cardsRef.current.getBoundingClientRect().top;
  if (tabsTop >= 0) return;

  window.scrollTo({
    top: tabsTop + window.scrollY - 10,
    behavior: smooth ? 'smooth' : 'auto',
  });
};
