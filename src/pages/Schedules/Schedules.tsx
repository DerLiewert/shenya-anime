import React from 'react';
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Broadcast, CommonIntro, Seasonal } from '@/components';
import './Schedules.scss';
import NotFound from '../NotFound/NotFound';

const routeItems: { label: string; path: string; element: React.JSX.Element }[] = [
  { label: 'Currently Airing', path: 'broadcast', element: <Broadcast /> },
  { label: 'Seasonal Anime', path: 'seasonal', element: <Seasonal /> },
];

function Schedules() {
  const navigate = useNavigate();
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  // React.useEffect(() => {
  //   if (segments.length === 1) {
  //     navigate({ pathname: `/${segments[0]}/${routeItems[0].path}` }, { replace: true });
  //   }
  // }, [location.pathname]);

  if (
    (segments.length > 1 && !routeItems.find((obj) => obj.path === segments[1])) ||
    segments.length > 2
  )
    return <NotFound />;
    
  return (
    <div className="schedules">
      <CommonIntro bgPrefix="schedules" title="Schedules Anime" />
      <div className="schedules__tabs schedules-tabs">
        <div className="container">
          <div className="schedules-tabs__list">
            {routeItems.map((item) => (
              <div
                key={item.path}
                className="schedules-tabs__trigger fz-16 "
                aria-selected={segments[1] === item.path}
                onClick={(e) => {
                  if (e.currentTarget.getAttribute('aria-selected') === 'true') return;
                  navigate({ pathname: `/${segments[0]}/${item.path}` });
                }}>
                {item.label}
              </div>
            ))}
          </div>
          <div className="schedules-tabs__content">
            {/* <Route key={routeItems[0].path} path={'/'} element={routeItems[0].element} /> */}
            <Routes>
              <Route index element={<Navigate to={routeItems[0].path} replace />} />
              {routeItems.map((item) => (
                <Route key={item.path} path={item.path} element={item.element} />
              ))}
              {/* <Route path={'*'} element={<Navigate to="/not-found" replace />} /> */}
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Schedules;
