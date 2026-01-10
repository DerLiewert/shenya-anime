import React from 'react';
import { Routes, useNavigate } from 'react-router-dom';
import { usePathSegments, useScrollTarget } from '@/hooks';
import { generateRoutes, isValidPath } from '@/utils';
import { appPaths } from '@/resources';
import { TabRoute } from '@/typescript';
import { NotFound } from '@/pages';
import { CommonIntro, Broadcast, Seasonal } from '@/components';
import './Schedules.scss';

const routeItems: TabRoute[] = [
  { label: 'Currently Airing', value: 'broadcast', element: <Broadcast /> },
  { label: 'Seasonal Anime', value: 'seasonal', element: <Seasonal /> },
];

const pagePath = appPaths.schedules;

function Schedules() {
  const navigate = useNavigate();
  const tabSegments = usePathSegments(pagePath);
  const tabsRef = React.useRef<HTMLDivElement>(null);

  useScrollTarget(tabsRef);

  if (!isValidPath(tabSegments, routeItems)) return <NotFound />;

  return (
    <div className="schedules">
      <CommonIntro bgPrefix="schedules" title="Schedules Anime" />
      <div className="schedules__tabs schedules-tabs">
        <div className="container">
          <div className="schedules-tabs__list tab-list" ref={tabsRef}>
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
