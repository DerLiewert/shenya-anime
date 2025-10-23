import React from 'react';
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
// import { CommonIntro, Broadcast, Seasonal } from '@/components';
import { CommonIntro } from '@/components';
import { NotFound } from '@/pages';
import { TabRoute } from '@/typescript';
import './Schedules.scss';
import Broadcast from '@/components/Sections/Broadcast/Broadcast';
import Seasonal from '@/components/Sections/Seasonal/Seasonal';
import { appPaths } from '@/resources';

const routeItems: TabRoute[] = [
  { label: 'Currently Airing', value: 'broadcast', element: <Broadcast /> },
  { label: 'Seasonal Anime', value: 'seasonal', element: <Seasonal /> },
];

const pagePath = appPaths.schedules;

function Schedules() {
  const navigate = useNavigate();
  const location = useLocation();
  const tabSegments = location.pathname.replace(pagePath, '').split('/').filter(Boolean);

  if (tabSegments.length > 0 && !routeItems.find((obj) => obj.value === tabSegments[0]))
    return <NotFound />;

  return (
    <div className="schedules">
      <CommonIntro bgPrefix="schedules" title="Schedules Anime" />
      <div className="schedules__tabs schedules-tabs">
        <div className="container">
          <div className="schedules-tabs__list tab-list">
            {routeItems.map((item) => (
              <div
                key={item.value}
                className="tab-list__trigger fz-16"
                aria-selected={tabSegments[0] === item.value}
                onClick={(e) => {
                  if (e.currentTarget.getAttribute('aria-selected') === 'true') return;
                  navigate(`${pagePath}/${item.value}`);
                }}>
                {item.label}
              </div>
            ))}
          </div>
          <div className="schedules-tabs__content">
            <Routes>
              <Route index element={<Navigate to={routeItems[0].value} replace />} />
              {routeItems.map((item) => (
                <Route key={item.value} path={item.value} element={item.element} />
              ))}
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Schedules;
