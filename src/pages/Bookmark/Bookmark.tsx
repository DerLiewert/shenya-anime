import React from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { RootState } from '@/app/store';
import { useAppSelector } from '@/app/hooks';
import { AnimeCard, CommonIntro, EmptyValueMessage, MangaCard } from '@/components';
import { AnimeAndMangaOf, AnimeAndMangaType, TabRoute } from '@/typescript';
import { appPaths } from '@/resources';
import { usePathSegments, useScrollTarget } from '@/hooks';
import { isValidPath } from '@/utils';
import NotFound from '../NotFound/NotFound';
import './Bookmark.scss';

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
  const bookmarkTabsRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const tabSegments = usePathSegments(pagePath);

  useScrollTarget(bookmarkTabsRef);

  if (!isValidPath(tabSegments, routeItems)) return <NotFound />;

  return (
    <div className="bookmark">
      <CommonIntro bgPrefix="bookmark" title="Bookmark" />
      <div className="container">
        <div className="bookmark__inner">
          <div className="bookmark__list tab-list" ref={bookmarkTabsRef}>
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
  selector: (state: RootState) => Record<number, AnimeAndMangaOf<T>>;
}

function BookmarkedItems<T extends AnimeAndMangaType>({ type, selector }: BookmarkedItems<T>) {
  const items = useAppSelector(selector);
  // Чтоб при удалении айтема из Bookmarked, он оставался на странице до её обновления (на случай, если случайно удалили, чтоб сразу не исчезло)
  const [tempItemsByType, setTempItemsByType] = React.useState<Partial<Record<T, typeof items>>>(
    {},
  );

  React.useEffect(() => {
    setTempItemsByType((prev) => ({ ...prev, [type]: items }));
  }, [type]);

  React.useEffect(() => {
    setTempItemsByType((prev) => ({ ...prev, [type]: { ...prev[type], ...items } }));
  }, [items]);

  const tempItems = tempItemsByType[type] ?? {};

  if (Object.values(tempItems).length === 0)
    return <EmptyValueMessage message={`No bookmarked ${type}`} />;

  return (
    <div className="bookmark__items">
      {Object.values(tempItems)
        .sort((a, b) => {
          if (a.score && b.score) return b.score - a.score;
          else return 0;
        })
        .map((item) => {
          switch (type) {
            case 'anime':
              return <AnimeCard item={item as AnimeAndMangaOf<'anime'>} key={item.mal_id} />;
            case 'manga':
              return <MangaCard item={item as AnimeAndMangaOf<'manga'>} key={item.mal_id} />;
          }
        })}
    </div>
  );
}
