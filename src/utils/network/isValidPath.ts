import { TabRoute } from '@/typescript';

export const isValidPath = (pathParts: string[], tabs: TabRoute[]): boolean => {
  if (pathParts.length === 0) return true;

  const [current, ...rest] = pathParts;

  const tab = tabs.find((t) => t.value === current);

  if (!tab) return false;
  if (rest.length === 0) return true;
  if (!tab.children) return false;

  return isValidPath(rest, tab.children);
};
