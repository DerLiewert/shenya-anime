import React from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Broadcast, Seasonal } from '@/components';
import './Schedules.scss';

const routeItems: { label: string; path: string; element: React.JSX.Element }[] = [
  { label: 'Currently Airing', path: 'broadcast', element: <Broadcast /> },
  { label: 'Seasonal Anime', path: 'seasonal', element: <Seasonal /> },
];

function Schedules() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (location.pathname === '/schedules')
      navigate({ pathname: `/${segments[0]}/${routeItems[0].path}` }, { replace: true });
  }, [location.pathname]);

  return (
    <div className="schedules">
      <ScheduleslIntro title="Schedules Anime" />
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
            <Routes>
              {routeItems.map((item) => (
                <Route key={item.path} path={'/' + item.path} element={item.element} />
              ))}
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Schedules;

/*==========================
/*====== ScheduleslIntro ======
/*=========================*/
const ScheduleslIntro: React.FC<{ title: string }> = ({ title }) => {
  return (
    <section className="catalog__intro catalog-intro ">
      <div className="container">
        <div className="catalog-intro__inner">
          <h2 className="catalog-intro__title title">{title}</h2>
        </div>
      </div>
    </section>
  );
};
