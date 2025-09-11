import { Outlet, Route } from 'react-router-dom';
import { TabRoute } from '@/typescript';

// Рекурсивный рендер Route
export const renderTabRoutes = (tabs: TabRoute[], depth: number = 0): React.ReactNode =>
  tabs.map((tab, index) => {
    const path = tab.value;
    if (tab.children) {
      return (
        <Route key={path} path={depth === 0 && index === 0 ? '' : tab.value} element={<Outlet />}>
          <Route index element={tab.element} />
          {renderTabRoutes(tab.children, depth + 1)}
        </Route>
      );
    }
    return depth === 0 && index === 0 ? (
      <Route key={tab.value} index element={tab.element} />
    ) : (
      <Route key={tab.value} path={tab.value} element={tab.element} />
    );
  });
