import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import { AppAsyncThunk } from '@/app/appAsyncThunk';
import {
  useAbortableDispatch,
  useFetchStatus,
  useMatchMedia,
  usePathSegments,
  useTabsPageScrollToTop,
} from '@/hooks';
import { breakpoints, LG_LICENSE_KEY } from '@/constants';
import { getImageUrl, generateRoutes, isValidPath } from '@/utils';
import { NotFound } from '@/pages';
import {
  BookmarkButton,
  Breadcrumbs,
  SfwImage,
  TabList,
  TrailerButton,
  TrailerImage,
} from '@/components';

import type { RootState } from '@/app/store';
import type {
  AnimeFull,
  AnimeYoutubeVideo,
  CharacterFull,
  MangaFull,
  PersonFull,
  ProducerFull,
  FetchStatus,
  StatusSelector,
  TabRoute,
} from '@/typescript';

import LightGallery from 'lightgallery/react';
import lgZoom from 'lightgallery/plugins/zoom';
import 'lightgallery/scss/lg-zoom.scss';
import 'lightgallery/scss/lg-video.scss';

import clsx from 'clsx';
import './EntityPageLayout.scss';

type ItemTypes = AnimeFull | MangaFull | PersonFull | CharacterFull | ProducerFull;
type NullableItemTypes<T> = T | null;

type BookmarkByEntity<T> = T extends AnimeFull ? 'anime' : T extends MangaFull ? 'manga' : never;

interface EntityRenderResult<T> {
  title: string | null;
  subtitles?: string[];
  resources?: React.ReactElement | null;
  trailer?: AnimeYoutubeVideo | null;
  bookmark?: BookmarkByEntity<T>;
  breadcrumbs?: { label: string | number; url: string }[];
  tabs: TabRoute[];
}

interface EntityPageLayoutProps<T extends ItemTypes> {
  // Redux-related
  fetchAction: AppAsyncThunk<T, any>;
  itemSelector: (state: RootState) => NullableItemTypes<T>;
  itemStatusSelector: StatusSelector | FetchStatus | undefined | null;

  // Base
  createBasePath: (id: number) => string;
  introBg?: string;
  isNsfw?: (item: NullableItemTypes<T>) => boolean;

  // Render logic
  render: (item: NullableItemTypes<T>) => EntityRenderResult<T>;
}

const EntityPageLayout = <T extends ItemTypes>({
  isNsfw = () => false,
  introBg,
  createBasePath,
  fetchAction,
  itemSelector,
  itemStatusSelector,
  render,
}: EntityPageLayoutProps<T>) => {
  const tabsRef = React.useRef<HTMLDivElement>(null);
  const isTablet = useMatchMedia('max', breakpoints.tablet);
  const isMobile = useMatchMedia('max', breakpoints.mobile);

  const abortableDispatch = useAbortableDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const id = Number(useParams().id);
  const basePath = createBasePath(id);
  const tabSegments = usePathSegments(basePath);

  const item = useAppSelector(itemSelector);
  const renderItem = React.useMemo(() => render(item), [item, render]);
  const { isLoading, isSuccess, isError } = useFetchStatus(itemStatusSelector);

  const [activeTab, setActiveTab] = React.useState(tabSegments[0]);
  const [isPosterLoading, setIsPosterLoading] = React.useState(true);

  useTabsPageScrollToTop(tabsRef, [id]);

  React.useEffect(() => {
    abortableDispatch(fetchAction, id);
  }, [id, fetchAction]);

  React.useEffect(() => {
    if (activeTab !== tabSegments[0]) setActiveTab(tabSegments[0]);
  }, [location.pathname, renderItem.tabs]);

  React.useEffect(() => {
    if (!isPosterLoading) setIsPosterLoading(true);
  }, [item]);

  // Рендер постера аниме
  const renderPoster = () =>
    item ? (
      <LightGallery
        addClass="pictures-tab-gallery"
        elementClassNames={clsx('full-page-leftside__poster border-radius', {
          'full-page-leftside__poster--loading': isPosterLoading,
        })}
        licenseKey={LG_LICENSE_KEY}
        plugins={[lgZoom]}
        speed={300}
        thumbHeight={'60px'}
        thumbWidth={80}
        mobileSettings={{
          showCloseIcon: true,
          download: true,
          controls: false,
        }}>
        <a href={getImageUrl(item.images)}>
          <SfwImage
            nsfw={isNsfw(item)}
            src={getImageUrl(item.images)}
            alt="Poster"
            onLoad={() => {
              setIsPosterLoading(false);
            }}
          />
        </a>
      </LightGallery>
    ) : (
      <Skeleton
        className="img _skeleton"
        containerClassName="full-page-leftside__poster border-radius"
      />
    );

  // Рендер блока ресурсов
  const renderAnimeResources = () => {
    return item ? renderItem.resources : <Skeleton className="border-radius" height="150px" />;
  };

  if (isError || (isSuccess && !item) || (!isLoading && !isValidPath(tabSegments, renderItem.tabs)))
    return <NotFound />;

  return (
    <div className="full-page">
      <div className="full-page__intro full-page-intro bg">
        {isLoading ? (
          <SkeletonTheme baseColor="transparent">
            <Skeleton className="img" />
          </SkeletonTheme>
        ) : !renderItem.trailer ? (
          <img src={introBg} alt="Background image" aria-hidden />
        ) : (
          <TrailerImage trailer={renderItem.trailer} />
        )}

        <div className="full-page-intro__container container">
          {isMobile && renderPoster()}
          <div className="full-page-intro__body">
            <h2 className="full-page-intro__title title title--fz-48">
              {item && renderItem.title ? renderItem.title : <Skeleton />}
            </h2>
            {!item ? (
              <h3 className="full-page-intro__sub-title title">
                <Skeleton />
              </h3>
            ) : (
              renderItem.subtitles &&
              renderItem.subtitles.map((str, index) => (
                <h3
                  className="full-page-intro__sub-title title visible-line"
                  title={str}
                  key={index}>
                  {str}
                </h3>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="full-page__about full-page-about">
        <div className="container">
          <div className="full-page-about__inner">
            {/* Если isMobile (window < 768px), то в full-page-leftside остаются только кнопки, поэтому при isMobile рендерим блок только если есть кнопки, иначе он пустой */}
            {(!isMobile || (isMobile && (renderItem.trailer || renderItem.bookmark))) && (
              <div className="full-page-about__left full-page-leftside">
                {!isMobile && renderPoster()}
                {(renderItem.trailer || renderItem.bookmark) && (
                  <div className="full-page-leftside__buttons">
                    {(renderItem.trailer || renderItem.trailer === null) &&
                      (!item ? (
                        <Skeleton height="40px" className="border-radius" />
                      ) : (
                        (renderItem.trailer as any).embed_url && (
                          <TrailerButton
                            trailer={renderItem.trailer as any}
                            lightGalleryClass="full-page-video-trailer"
                            className="full-page-leftside__btn"
                          />
                        )
                      ))}

                    {renderItem.bookmark &&
                      (item ? (
                        <BookmarkButton
                          item={item as any}
                          type={renderItem.bookmark}
                          className="full-page-leftside__btn btn btn--upper btn--icon btn--stroke btn--white"
                          bookmarkedClassName="btn--fill"
                        />
                      ) : (
                        <Skeleton height="40px" className="border-radius" />
                      ))}
                  </div>
                )}
                {!isTablet && renderAnimeResources()}
              </div>
            )}

            <div className="full-page-about__body">
              {renderItem.breadcrumbs &&
                (item ? (
                  <Breadcrumbs
                    className="full-page-about__breadcrumbs"
                    items={renderItem.breadcrumbs}
                  />
                ) : (
                  <Skeleton
                    className="full-page-about__breadcrumbs"
                    height="20px"
                    style={{ maxWidth: '480px' }}
                  />
                ))}

              {item ? (
                <div ref={tabsRef} className="full-page-about__tabs full-page-tabs">
                  <TabList
                    tabs={renderItem.tabs}
                    activeTab={activeTab}
                    onTabClick={(value) => navigate(`${basePath}/${value}`)}
                  />
                  <div className="full-page-tabs__body">
                    <Routes>
                      {generateRoutes(renderItem.tabs)}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
                </div>
              ) : (
                <Skeleton
                  containerClassName="full-page-about__tabs"
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
