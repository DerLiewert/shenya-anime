import React from 'react';
import { Link, Outlet, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import {
  useAbortableDispatch,
  useFetchStatus,
  useMatchMedia,
  useYoutubeTrailerImage,
} from '@/hooks';
import { getImageUrl } from '@/utils';
import { MEDIA_QUERY } from '@/variables';

import { BookmarkIcon, Breadcrumbs, PlayCircleIcon, TabList } from '@/components';

import { Anime, AnimeYoutubeVideo, CharacterFull, Manga, PersonFull } from '@/models';

import LightGallery from 'lightgallery/react';
import lgVideo from 'lightgallery/plugins/video';
import 'lightgallery/scss/lg-video.scss';

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import clsx from 'clsx';
import './AnimePage.scss';
import NotFound from '@/pages/NotFound/NotFound';
import { AsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';
import { FetchStatus, StatusSelector, TabRoute } from '@/typescript';

type ItemTypes = Anime | Manga | PersonFull | CharacterFull;
type NullableItemTypes<T> = T | null;

interface EntityRenderResult {
  title: string | null;
  subtitles?: string[];
  resources?: React.ReactElement | null;
  trailer?: AnimeYoutubeVideo | null;
  breadcrumbs: { label: string; url: string }[];
  tabs: TabRoute[];
}

interface EntityPageLayoutProps<T extends ItemTypes> {
  // Redux-related
  actionCreator: AsyncThunk<T, any, any>;
  selector: (state: RootState) => NullableItemTypes<T>;
  status: StatusSelector | FetchStatus | undefined;

  // Base
  getBasePath: (id: number) => string;
  introBg?: string;

  // Render logic
  render: (item: NullableItemTypes<T>) => EntityRenderResult;
}

const EntityPageLayout = <T extends ItemTypes>({
  introBg,
  getBasePath,
  actionCreator,
  selector,
  status,
  render,
}: EntityPageLayoutProps<T>) => {
  const location = useLocation();
  const navigate = useNavigate();
  const id = Number(useParams<{ id: string }>().id);
  const basePath = getBasePath(id);
  const activeTabFromUrl = decodeURIComponent(
    location.pathname.split(basePath)[1]?.split('/').filter(Boolean)[0],
  );

  const item = useAppSelector(selector);
  const renderItems = React.useMemo(() => render(item), [item]);
  useAbortableDispatch(actionCreator, id, !item || item.mal_id !== id);

  const { isLoading, isSuccess, isError } = useFetchStatus(status);
  const { src, onLoad, isFallback } = useYoutubeTrailerImage(
    renderItems.trailer ? renderItems.trailer.images : null,
  );

  const isTablet = useMatchMedia('max', MEDIA_QUERY.tablet);
  const isMobile = useMatchMedia('max', MEDIA_QUERY.mobile);

  const getTab = () => {
    if (renderItems.tabs.length === 0 || activeTabFromUrl === renderItems.tabs[0].value) return '';
    if (renderItems.tabs.find((obj) => obj.value === activeTabFromUrl)?.value)
      return activeTabFromUrl;
    return renderItems.tabs[0].value || '';
  };

  const [activeTab, setActiveTab] = React.useState(getTab());
  const tabsRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const currentTab = getTab();
    if (currentTab !== activeTab) {
      if (renderItems.tabs.find((item) => item.value === currentTab)) setActiveTab(currentTab);
      else setActiveTab('');
    }

    if (!tabsRef.current) return;

    const tabsTop = tabsRef.current.getBoundingClientRect().top;
    if (tabsTop >= 0) return;

    window.scrollTo({
      top: tabsTop + window.scrollY - 10,
      behavior: 'smooth',
    });
  }, [location]);

  React.useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [id]);

  React.useEffect(() => {
    setActiveTab(getTab());
  }, [renderItems.tabs]);

  // Рекурсивный рендер Route
  const renderTabRoutes = (tabs: TabRoute[], depth: number = 0): React.ReactNode =>
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

  // Рендер постера аниме
  const renderPoster = () => (
    <div className="anime-leftside__poster image-centered border-radius">
      {item ? (
        <img src={getImageUrl(item.images)} alt="Poster" />
      ) : (
        <Skeleton className="anime-skeleton__image _skeleton" />
      )}
    </div>
  );

  // Рендер блока ресурсов
  const renderAnimeResources = () => {
    return item ? (
      renderItems.resources //   <AnimeResources item={item} />
    ) : (
      <Skeleton className="border-radius" height="150px" />
    );
  };

  // Рендер сайдбара
  const renderLeftside = () => (
    <div className="anime-about__left anime-leftside">
      {!isMobile && renderPoster()}

      {item ? (
        <div className="anime-leftside__buttons">
          {renderItems.trailer && (
            <LightGallery
              addClass="anime-video-trailer"
              licenseKey="7EC452A9-0CFD441C-BD984C7C-17C8456E"
              plugins={[lgVideo]}
              download={false}
              controls={false}
              counter={false}
              youTubePlayerParams={{
                rel: 0,
                autoplay: 1,
                mute: 0,
              }}
              mobileSettings={{
                showCloseIcon: true,
                download: false,
                controls: false,
              }}>
              <button
                className="anime-leftside__btn btn btn--upper btn--icon btn--stroke"
                data-src={renderItems.trailer.url}>
                <PlayCircleIcon />
                watch trailer
              </button>
            </LightGallery>
          )}
          <button className="anime-leftside__btn btn btn--upper btn--icon btn--stroke btn--white">
            <BookmarkIcon />
            bookmark
          </button>
        </div>
      ) : (
        <div className="anime-leftside__buttons">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} height="40px" className="border-radius" />
          ))}
        </div>
      )}
      {!isTablet && renderAnimeResources()}
    </div>
  );

  // Смена активного таба при клике на таб
  const onTabTrigger = React.useCallback(
    (value: string) => {
      setActiveTab(value);
      navigate(
        renderItems.tabs.length > 0 && value === renderItems.tabs[0].value
          ? basePath
          : `${basePath}/${value}`,
      );
    },
    [basePath, item],
  );
  // const matchedTab = renderItems.tabs.find((obj) => obj.value === activeTabFromUrl);

  const isValidPath = (pathParts: string[], tabs: TabRoute[]): boolean => {
    if (pathParts.length === 0) return true;

    const [current, ...rest] = pathParts;

    const tab = tabs.find((t) => t.value === current);
    // console.log(tab, current, rest);
    if (!tab) return false;
    if (rest.length === 0) return true;
    if (!tab.children) return false;

    return isValidPath(rest, tab.children);
  };

  const rawPathParts = location.pathname
    .replace(basePath, '')
    .split('/')
    .filter(Boolean)
    .map(decodeURIComponent);

  const firstTab = renderItems.tabs[0]?.value;
  const directMatch = isValidPath(rawPathParts, renderItems.tabs);

  const fallbackMatch =
    firstTab && !directMatch ? isValidPath([firstTab, ...rawPathParts], renderItems.tabs) : false;

  const pathIsValid = directMatch || fallbackMatch;
  if ((isSuccess && !item) || isError || !pathIsValid) return <NotFound />;

  return (
    <div className="anime">
      <div className="anime__intro anime-intro">
        <div className="anime-intro__bg bg">
          {renderItems.trailer ? (
            src ? (
              <img
                className={clsx({ '_not-found': isFallback })}
                src={src}
                onLoad={onLoad}
                alt="Background image"
                aria-hidden
              />
            ) : (
              <SkeletonTheme baseColor="transparent">
                <Skeleton className="anime-skeleton__image" />
              </SkeletonTheme>
            )
          ) : (
            <img src={introBg} alt="Background image" aria-hidden />
          )}
          {/* {src ? (
            renderItems.trailer ? (
              <img
                className={clsx({ '_not-found': isFallback })}
                src={src}
                onLoad={onLoad}
                alt="Background image"
                aria-hidden
              />
            ) : (
              <img src={introBg} alt="Background image" aria-hidden />
            )
          ) : (
            <SkeletonTheme baseColor="transparent">
              <Skeleton className="anime-skeleton__image" />
            </SkeletonTheme>
          )} */}
        </div>

        <div className="anime-intro__container container">
          {isMobile && renderPoster()}
          <div className="anime-intro__body">
            <h2 className="anime-intro__title title title--fz-48">
              {item && renderItems.title ? renderItems.title : <Skeleton />}
            </h2>
            {!item &&
              Array.from({ length: 2 }).map((_, i) => (
                <h3 key={i} className="anime-intro__sub-title title">
                  <Skeleton />
                </h3>
              ))}
            {renderItems.subtitles &&
              renderItems.subtitles.length > 0 &&
              renderItems.subtitles.map((str, index) => (
                <h3 className="anime-intro__sub-title title" title={str} key={index}>
                  {str}
                </h3>
              ))}
          </div>
        </div>
      </div>

      <div className="anime__about anime-about">
        <div className="container">
          <div className="anime-about__inner">
            {renderLeftside()}
            <div className="anime-about__body">
              {item ? (
                <Breadcrumbs className="anime-about__breadcrumbs" items={renderItems.breadcrumbs} />
              ) : (
                <Skeleton
                  className="anime-about__breadcrumbs"
                  height="20px"
                  style={{ maxWidth: '480px' }}
                />
              )}

              {item ? (
                <div ref={tabsRef} className="anime-about__tabs anime-tabs">
                  <TabList
                    tabs={renderItems.tabs}
                    activeTab={activeTab}
                    onTabTrigger={onTabTrigger}
                  />
                  <div className="anime-tabs__body">
                    <Routes>
                      {renderTabRoutes(renderItems.tabs)}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
                </div>
              ) : (
                <Skeleton
                  containerClassName="anime-about__tabs"
                  height="100%"
                  style={{ minHeight: ' 200px' }}
                />
              )}
            </div>
            {isTablet && renderAnimeResources()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntityPageLayout;
