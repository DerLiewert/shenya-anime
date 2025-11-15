import { useLocation } from 'react-router-dom';

export const usePathSegments = (basePath: string) => {
  const location = useLocation();
  return location.pathname.replace(basePath, '').split('/').filter(Boolean).map(decodeURIComponent);
};
