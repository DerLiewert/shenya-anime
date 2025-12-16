import React from 'react';
import { Routes, useNavigate } from 'react-router-dom';
// import { CommonIntro, Broadcast, Seasonal } from '@/components';
import { CommonIntro } from '@/components';
import { NotFound } from '@/pages';
import { TabRoute } from '@/typescript';
import Broadcast from '@/components/Sections/Broadcast/Broadcast';
import Seasonal from '@/components/Sections/Seasonal/Seasonal';
import { appPaths } from '@/resources';
import { usePathSegments } from '@/hooks';
import { generateRoutes } from '@/utils';
import { setScrollToTop } from '@/store';
import { useDispatch } from 'react-redux';
import './Schedules.scss';

const routeItems: TabRoute[] = [
  { label: 'Currently Airing', value: 'broadcast', element: <Broadcast /> },
  { label: 'Seasonal Anime', value: 'seasonal', element: <Seasonal /> },
];

const pagePath = appPaths.schedules;

function Schedules() {
  const navigate = useNavigate();
  const tabSegments = usePathSegments(pagePath);

  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(setScrollToTop(false));
    return () => {
      dispatch(setScrollToTop(true));
    };
  }, []);

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
            <Routes>{generateRoutes(routeItems)}</Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Schedules;

//========================================================================================================================================================

// const RouteTab = (routeItems: TabRoute[], className?: string) => {
//   return (
//     <div className={clsx(className, 'tab-list')}>
//       {routeItems.map((item) => (
//         <div
//           key={item.value}
//           className="tab-list__trigger fz-16"
//           aria-selected={tabSegments[0] === item.value}
//           onClick={(e) => {
//             if (e.currentTarget.getAttribute('aria-selected') === 'true') return;
//             navigate(`${pagePath}/${item.value}`);
//           }}>
//           {item.label}
//         </div>
//       ))}
//     </div>
//   );
// };
