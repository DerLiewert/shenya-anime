export const scrollToTop = (ref: React.RefObject<HTMLElement | null>, smooth: boolean = false) => {
  if (!ref.current) return;

  const tabsTop = ref.current.getBoundingClientRect().top;
  if (tabsTop >= 0) return;

  window.scrollTo({
    top: tabsTop + window.scrollY - 10,
    behavior: smooth ? 'smooth' : 'auto',
  });
};
