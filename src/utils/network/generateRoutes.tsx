import { Navigate, Outlet, Route } from 'react-router-dom';
import { TabRoute } from '@/typescript';
import React from 'react';

// Рекурсивный рендер Route
export const generateRoutes = (tabs: TabRoute[], depth: number = 0): React.ReactNode =>
  tabs.map((tab, index) => {
    const { value: path, element, children } = tab;
    const isFirstRoot = depth === 0 && index === 0;
    const key = `${path}-${depth}`;

    if (children) {
      return (
        <React.Fragment key={key}>
          <Route index element={<Navigate to={path} replace />} />
          <Route path={path} element={<Outlet />}>
            <Route index element={element} />
            {generateRoutes(children, depth + 1)}
          </Route>
        </React.Fragment>
      );
    }

    if (isFirstRoot) {
      return (
        <React.Fragment key={key}>
          <Route index element={<Navigate to={path} replace />} />
          <Route path={path} element={element} />
        </React.Fragment>
      );
    }

    return <Route key={key} path={path} element={tab.element} />;
  });
