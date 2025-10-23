import React from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import { AnimeCard, CommonIntro, MangaCard } from '@/components';
import { TabRoute } from '@/typescript';
import './Bookmark.scss';
import NotFound from '../NotFound/NotFound';
import { appPaths } from '@/resources';

const routeItems: TabRoute[] = [
  { label: 'Anime', value: 'anime', element: <BookmarkedAnime /> },
  { label: 'Manga', value: 'manga', element: <BookmarkedManga /> },
];

const pagePath = appPaths.bookmark;

const Bookmark = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tabSegments = location.pathname.replace(pagePath, '').split('/').filter(Boolean);
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
          <div className="bookmark__items">
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
};

export default Bookmark;

//========================================================================================================================================================
function BookmarkedAnime() {
  const items = useAppSelector((state) => state.bookmark.anime);
  const sfw = useAppSelector((state) => state.settings.sfw);
  const sfwItems = sfw
    ? Object.values(items).filter((item) => item.genres.find((obj) => obj.mal_id !== 12))
    : Object.values(items);

  return (
    <>
      {sfwItems
        .sort((a, b) => {
          if (a.score && b.score) return b.score - a.score;
          else return 0;
        })
        .map((item) => (
          <AnimeCard item={item} key={item.mal_id} />
        ))}
    </>
  );
}

function BookmarkedManga() {
  const items = useAppSelector((state) => state.bookmark.manga);
  const sfw = useAppSelector((state) => state.settings.sfw);
  const sfwItems = sfw
    ? Object.values(items).filter((item) => item.genres.find((obj) => obj.mal_id !== 12))
    : Object.values(items);

  return (
    <>
      {sfwItems
        .sort((a, b) => {
          if (a.score && b.score) return b.score - a.score;
          else return 0;
        })
        .map((item) => (
          <MangaCard item={item} key={item.mal_id} />
        ))}
    </>
  );
}
