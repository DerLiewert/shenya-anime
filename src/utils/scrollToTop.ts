export const scrollToTop = (
  ref: React.RefObject<HTMLElement | null>,
  options: { smooth: boolean } = { smooth: false },
) => {
  if (!ref.current) return;

  const rect = ref.current.getBoundingClientRect();
  // if (rect.top >= 0 && rect.top < window.innerHeight) return;
  if (rect.top >= 0) return;

  window.scrollTo({
    top: rect.top + window.scrollY - 10,
    behavior: options.smooth ? 'smooth' : 'auto',
  });
};
