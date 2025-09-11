import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import {
  useAbortableDispatch,
  useFetchStatus,
  useMatchMedia,
  useYoutubeTrailerImage,
} from '@/hooks';
import { getImageUrl, renderTabRoutes, scrollToTop } from '@/utils';
import { MEDIA_QUERY } from '@/variables';

import NotFound from '@/pages/NotFound/NotFound';
import { BookmarkIcon, Breadcrumbs, PlayCircleIcon, TabList } from '@/components';

import type { AsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import type { FetchStatus, StatusSelector, TabRoute } from '@/typescript';
import type { AnimeFull, AnimeYoutubeVideo, CharacterFull, MangaFull, PersonFull } from '@/models';

import LightGallery from 'lightgallery/react';
import lgVideo from 'lightgallery/plugins/video';
import 'lightgallery/scss/lg-video.scss';

import clsx from 'clsx';
import './AnimePage.scss';

type ItemTypes = AnimeFull | MangaFull | PersonFull | CharacterFull;
type NullableItemTypes<T> = T | null;

interface EntityRenderResult {
  title: string | null;
  subtitles?: string[];
  resources?: React.ReactElement | null;
  trailer?: AnimeYoutubeVideo | null;
  breadcrumbs?: { label: string | number; url: string }[];
  tabs: TabRoute[];
}

interface EntityPageLayoutProps<T extends ItemTypes> {
  // Redux-related
  fetchAction: AsyncThunk<T, any, any>;
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
  fetchAction,
  selector,
  status,
  render,
}: EntityPageLayoutProps<T>) => {
  const abortableDispatch = useAbortableDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const id = Number(useParams().id);
  const basePath = getBasePath(id);
  const activeTabFromUrl = decodeURIComponent(
    location.pathname.split(basePath)[1]?.split('/').filter(Boolean)[0],
  );

  const item = useAppSelector(selector);
  const renderItem = React.useMemo(() => render(item), [item]);
  const { isLoading, isSuccess, isError } = useFetchStatus(status);
  const { src, onLoad, isFallback } = useYoutubeTrailerImage(
    renderItem.trailer ? renderItem.trailer.images : null,
  );

  const isTablet = useMatchMedia('max', MEDIA_QUERY.tablet);
  const isMobile = useMatchMedia('max', MEDIA_QUERY.mobile);

  const getTab = () => {
    if (renderItem.tabs.length === 0 || activeTabFromUrl === renderItem.tabs[0].value) return '';
    if (renderItem.tabs.find((obj) => obj.value === activeTabFromUrl)?.value)
      return activeTabFromUrl;
    return renderItem.tabs[0].value || '';
  };

  const [activeTab, setActiveTab] = React.useState(getTab());
  const tabsRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    abortableDispatch(fetchAction, id);
  }, [id]);

  React.useEffect(() => {
    const currentTab = getTab();
    if (currentTab !== activeTab) {
      if (renderItem.tabs.find((item) => item.value === currentTab)) setActiveTab(currentTab);
      else setActiveTab('');
    }

    scrollToTop(tabsRef, true);
  }, [location]);

  React.useEffect(() => {
    scrollToTop(tabsRef);
  }, [location.pathname]);

  React.useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [id]);

  React.useEffect(() => {
    setActiveTab(getTab());
  }, [renderItem.tabs]);

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
    return item ? renderItem.resources : <Skeleton className="border-radius" height="150px" />;
  };

  // Смена активного таба при клике на таб
  const onTabTrigger = React.useCallback(
    (value: string) => {
      setActiveTab(value);
      navigate(
        renderItem.tabs.length > 0 && value === renderItem.tabs[0].value
          ? basePath
          : `${basePath}/${value}`,
      );
    },
    [basePath, item],
  );
  // const matchedTab = renderItem.tabs.find((obj) => obj.value === activeTabFromUrl);

  const isValidPath = (pathParts: string[], tabs: TabRoute[]): boolean => {
    if (pathParts.length === 0) return true;

    const [current, ...rest] = pathParts;

    const tab = tabs.find((t) => t.value === current);

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

  const firstTab = renderItem.tabs[0]?.value;
  const directMatch = isValidPath(rawPathParts, renderItem.tabs);

  const fallbackMatch =
    firstTab && !directMatch ? isValidPath([firstTab, ...rawPathParts], renderItem.tabs) : false;

  const pathIsValid = directMatch || fallbackMatch;
  if ((isSuccess && !item) || isError || !pathIsValid) return <NotFound />;

  return (
    <div className="anime">
      <div className="anime__intro anime-intro">
        <div className="anime-intro__bg bg">
          {renderItem.trailer ? (
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
        </div>

        <div className="anime-intro__container container">
          {isMobile && renderPoster()}
          <div className="anime-intro__body">
            <h2 className="anime-intro__title title title--fz-48">
              {item && renderItem.title ? renderItem.title : <Skeleton />}
            </h2>
            {!item &&
              Array.from({ length: 2 }).map((_, i) => (
                <h3 key={i} className="anime-intro__sub-title title">
                  <Skeleton />
                </h3>
              ))}
            {renderItem.subtitles &&
              renderItem.subtitles.length > 0 &&
              renderItem.subtitles.map((str, index) => (
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
            <div className="anime-about__left anime-leftside">
              {!isMobile && renderPoster()}
              {item ? (
                <div className="anime-leftside__buttons">
                  {renderItem.trailer && (
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
                        data-src={renderItem.trailer.url}>
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

            <div className="anime-about__body">
              {renderItem.breadcrumbs &&
                (item ? (
                  <Breadcrumbs
                    className="anime-about__breadcrumbs"
                    items={renderItem.breadcrumbs}
                  />
                ) : (
                  <Skeleton
                    className="anime-about__breadcrumbs"
                    height="20px"
                    style={{ maxWidth: '480px' }}
                  />
                ))}

              {item ? (
                <div ref={tabsRef} className="anime-about__tabs anime-tabs">
                  <TabList
                    tabs={renderItem.tabs}
                    activeTab={activeTab}
                    onTabTrigger={onTabTrigger}
                  />
                  <div className="anime-tabs__body">
                    <Routes>
                      {renderTabRoutes(renderItem.tabs)}
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
