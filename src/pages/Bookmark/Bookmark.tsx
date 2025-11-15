import React from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import { AnimeCard, CommonIntro, EmptyValueMessage, MangaCard } from '@/components';
import { AnimeAndMangaOf, AnimeAndMangaType, TabRoute } from '@/typescript';
import NotFound from '../NotFound/NotFound';
import { appPaths } from '@/resources';
import { usePathSegments } from '@/hooks';
import './Bookmark.scss';
import { RootState } from '@/app/store';

const routeItems: TabRoute[] = [
  {
    label: 'Anime',
    value: 'anime',
    element: <BookmarkedItems type="anime" selector={(state) => state.bookmark.anime} />,
  },
  {
    label: 'Manga',
    value: 'manga',
    element: <BookmarkedItems type="manga" selector={(state) => state.bookmark.manga} />,
  },
];

const pagePath = appPaths.bookmark;

const Bookmark = () => {
  const navigate = useNavigate();
  const tabSegments = usePathSegments(pagePath);

  if (tabSegments.length > 0 && !routeItems.find((obj) => obj.value === tabSegments[0]))
    return <NotFound />;

  return (
    <div className="bookmark">
      <CommonIntro bgPrefix="bookmark" title="Bookmark" />
      <div className="container">
        <div className="bookmark__inner">
          <div className="bookmark__list tab-list">
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
          <Routes>
            <Route index element={<Navigate to={routeItems[0].value} replace />} />
            {routeItems.map((item) => (
              <Route key={item.value} path={item.value} element={item.element} />
            ))}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Bookmark;

//========================================================================================================================================================
interface BookmarkedItems<T extends AnimeAndMangaType> {
  type: T;
  selector: (state: RootState) => { [key in number]: AnimeAndMangaOf<T> };
}

function BookmarkedItems<T extends AnimeAndMangaType>({ type, selector }: BookmarkedItems<T>) {
  const items = useAppSelector(selector);

  // Чтоб при удалении айтема из Bookmarked, он оставался на странице до её обновления (на случай, если случайно удалили, чтоб сразу не исчезло)
  const [tempData, setTempData] = React.useState({ type, items });
  React.useEffect(() => {
    setTempData({ type, items });
  }, [selector]);

  if (Object.values(tempData.items).length === 0)
    return <EmptyValueMessage message={`No bookmarked ${type}`} />;

  return (
    <div className="bookmark__items">
      {Object.values(tempData.items)
        .sort((a, b) => {
          if (a.score && b.score) return b.score - a.score;
          else return 0;
        })
        .map((item) => {
          switch (tempData.type) {
            case 'anime':
              return <AnimeCard item={item as AnimeAndMangaOf<'anime'>} key={item.mal_id} />;
            case 'manga':
              return <MangaCard item={item as AnimeAndMangaOf<'manga'>} key={item.mal_id} />;
          }
        })}
    </div>
  );
}
