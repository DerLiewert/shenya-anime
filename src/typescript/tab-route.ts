export type TabRoute = {
  value: string;
  element: React.ReactNode;
  children?: TabRoute[];
};
