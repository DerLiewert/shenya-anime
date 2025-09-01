export type TabRoute = {
  value: string;
  label: string;
  element: React.ReactNode;
  children?: TabRoute[];
};
