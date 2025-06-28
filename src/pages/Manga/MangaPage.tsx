import React from 'react';
import BG from '@/assets/manga-bg.jpeg';
import './MangaPage.scss';
import { BookmarkIcon, Breadcrumbs, LongArrowIcon, StaffTab } from '@/components';
import Skeleton from 'react-loading-skeleton';
import { useAbortableDispatch, useMatchMedia } from '@/hooks';
import { MEDIA_QUERY } from '@/variables';
import { createAnimePaths, createMangaPaths, getImageUrl } from '@/utils';
import { useAppSelector } from '@/app/hooks';
import { fetchFullMangaById } from '@/store/manga/mangaFullByIdSlice';
import { Link, Outlet, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { JikanNamedResource, Manga } from '@/models';
import { Swiper, SwiperProps, SwiperSlide } from 'swiper/react';
import { FreeMode, Scrollbar } from 'swiper/modules';
import type { Swiper as ISwiper } from 'swiper';

function MangaPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const id = Number(useParams<{ id: string }>().id);
  const basePath = createMangaPaths(id).fullManga;
  const activeTabFromUrl = location.pathname.split(basePath)[1].split('/').filter(Boolean)[0];
  const { item } = useAppSelector((state) => state.mangaFullById);
  useAbortableDispatch(fetchFullMangaById, id, !item || item.mal_id !== id);

  const japanesTitle = item ? item.titles.find((obj) => obj.type === 'Japanese') : null;
  const englishTitle = item ? item.titles.find((obj) => obj.type === 'English') : null;

  const isTablet = useMatchMedia('max', MEDIA_QUERY.tablet);
  const isMobile = useMatchMedia('max', MEDIA_QUERY.mobile);

  const tabs = React.useMemo(() => {
    if (!item) return [];

    return [
      {
        value: 'details',
        element: <div>details</div>,
        children: [
          {
            value: 'staff',
            element: (
              <>
                <Link to=".." className="anime-tabs__back-link back-link">
                  <LongArrowIcon />
                  Back to Details
                </Link>
                <StaffTab id={item.mal_id} />
              </>
            ),
          },
        ],
      },
      // {
      //   value: 'episodes',
      //   element: <div>episodes</div>,
      // },
      {
        value: 'characters',
        element: <div>characters</div>,
      },
      {
        value: 'pictures',
        element: <div>pictures</div>,
      },
      {
        value: 'news',
        element: <div>news</div>,
      },
      {
        value: 'recommendations',
        element: <div>recommendations</div>,
      },
      {
        value: 'more info',
        element: <div>more info</div>,
      },
    ];
  }, [item]);

  const getTab = () => {
    if (tabs.length === 0) return '';
    if (tabs.find((obj) => obj.value === activeTabFromUrl)?.value) return activeTabFromUrl;
    return tabs[0].value || '';
  };

  const [activeTab, setActiveTab] = React.useState(getTab());
  const tabsRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const currentTab = getTab();
    if (currentTab !== activeTab) setActiveTab(currentTab);

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
  }, [tabs]);

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
      <MangaResources item={item} />
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

  const onTabTrigger = React.useCallback(
    (value: string) => {
      setActiveTab(value);
      navigate(value === 'details' ? basePath : `${basePath}/${value}`);
    },
    [basePath],
  );

  return (
    <div className="anime">
      <div className="anime anime-intro">
        <div className="manga-intro__bg bg">
          <img src={BG} alt="Background image" aria-hidden />
        </div>
        <div className="anime-intro__container container">
          {isMobile && renderPoster()}
          <div className="anime-intro__body">
            <h2 className="anime-intro__title title title--fz-48">
              {item ? item.title : <Skeleton />}
            </h2>
            {!item &&
              Array.from({ length: 2 }).map((_, i) => (
                <h3 key={i} className="anime-intro__sub-title title">
                  <Skeleton />
                </h3>
              ))}
            {englishTitle && (
              <h3 className="anime-intro__sub-title title" title={englishTitle.title}>
                {englishTitle.title}
              </h3>
            )}
            {japanesTitle && (
              <h3 className="anime-intro__sub-title title" title={japanesTitle.title}>
                {japanesTitle.title}
              </h3>
            )}
          </div>
        </div>
      </div>
      <div className="anime__about anime-about">
        <div className="container">
          <div className="anime-about__inner">
            {renderLeftside()}
            <div className="anime-about__body">
              {item ? (
                <Breadcrumbs
                  className="anime-about__breadcrumbs"
                  items={[
                    { label: 'Top', url: '#' },
                    { label: 'Manga', url: '#' },
                    { label: item.title, url: '#' },
                  ]}
                />
              ) : (
                <Skeleton
                  className="anime-about__breadcrumbs"
                  height="20px"
                  style={{ maxWidth: '480px' }}
                />
              )}

              {item ? (
                <div ref={tabsRef} className="anime-about__tabs anime-tabs">
                  <Tabs tabs={tabs} activeTab={activeTab} onTabTrigger={onTabTrigger} />
                  <div className="anime-tabs__body">
                    <Routes>{renderTabRoutes(tabs)}</Routes>
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
            {/* {isTablet && renderAnimeResources()} */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MangaPage;

/* =====================
 === MangaResources ===
===================== */

type ResourcesList = {
  resources: JikanNamedResource[];
  title: string;
  emptyMessage: string;
};

const MangaResources: React.FC<{ item: Manga }> = ({ item }) => {
  const resources = item && item.external ? item.external : [];
  const official = resources.filter((obj) => obj.name === 'Official Site' || obj.name[0] === '@');
  const others = resources.filter((obj) => obj.name !== 'Official Site' && obj.name[0] !== '@');

  const renderResourcesList = ({ resources, title, emptyMessage }: ResourcesList) => (
    <div className="anime-leftside__item">
      <h4 className="anime-leftside__title">{title}</h4>
      <ul className="anime-leftside__list leftside-list">
        {resources.length > 0 ? (
          resources.map((resource) => (
            <li key={resource.url} className="leftside-list__item">
              <a
                href={resource.url}
                className="leftside-list__link"
                target="_blank"
                rel="noopener noreferrer">
                {resource.name}
              </a>
            </li>
          ))
        ) : (
          <li className="leftside-list__empry">{emptyMessage}</li>
        )}
      </ul>
    </div>
  );

  return (
    <div className="anime-leftside__resources">
      {renderResourcesList({
        resources: official,
        title: 'Available At',
        emptyMessage: 'Not Official Resources',
      })}
      {renderResourcesList({
        resources: others,
        title: 'Resources',
        emptyMessage: 'Not Other Resources',
      })}
    </div>
  );
};

/* =====================
 ======== Tabs ========
===================== */
export type TabRoute = {
  value: string;
  element: React.ReactNode;
  children?: TabRoute[];
};

interface TabsProps {
  tabs: Array<TabRoute | { value: string }>;
  activeTab: string;
  onTabTrigger: (value: string) => void;
}

const Tabs: React.FC<TabsProps> = React.memo(({ tabs, activeTab, onTabTrigger }) => {
  const tabRefs = React.useRef<Array<HTMLDivElement | null>>([]);
  const swiperRef = React.useRef<SwiperProps>(null);

  const focusTab = (index: number) => {
    const tab = tabRefs.current[index];
    if (tab) tab.focus();
  };

  const updateSwiper = (wrapper: HTMLElement, swiper: ISwiper, left: number) => {
    wrapper.style.transition = 'transform 0.3s ease 0s';
    wrapper.dataset.left = left.toString();
    swiper.setTranslate(left);
    // Обновить состояние и прогресс
    swiper.updateProgress();
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
    // Триггернуть нужные события (если нужны)
    swiper.emit('setTranslate', left);
    swiper.emit('transitionStart');
    swiper.emit('slideChangeTransitionStart');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();

    if (e.key === 'Enter' || e.key === ' ') {
      onTabTriggerClick(e);
      return;
    }

    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;

    const lastIndex = tabs.length - 1;
    let nextIndex = index;

    if (e.key === 'ArrowRight') {
      nextIndex = index === lastIndex ? 0 : index + 1;
    } else {
      nextIndex = index === 0 ? lastIndex : index - 1;
    }

    focusTab(nextIndex);

    if (!swiperRef.current) return;
    const swiper = swiperRef.current;
    const swiperEl = swiper.el;
    const wrapper = swiperEl.querySelector('.swiper-wrapper');
    if (!wrapper) return;
    const nextSlide = swiperEl.querySelectorAll('.swiper-slide')[nextIndex] as HTMLElement;
    if (!nextSlide) return;

    const slideRect = nextSlide.getBoundingClientRect();
    const swiperRect = swiperEl.getBoundingClientRect();
    const swiperWrapperRect = wrapper.getBoundingClientRect();

    if (slideRect.left <= swiperRect.left) {
      updateSwiper(wrapper, swiper, swiperWrapperRect.left - slideRect.left);
    } else if (slideRect.right >= swiperWrapperRect.right) {
      updateSwiper(wrapper, swiper, swiperWrapperRect.right - slideRect.right);
    }
  };

  const onTabTriggerClick = (
    e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
  ) => {
    const value = (e.currentTarget as HTMLElement).dataset.value;
    if (!value) return;

    onTabTrigger(value);
  };

  React.useEffect(() => {
    const index = tabs.findIndex((tab) => tab.value === activeTab);
    if (swiperRef.current && index !== -1) {
      swiperRef.current.slideTo(index, 300);
    }
  }, [activeTab]);

  return (
    <Swiper
      modules={[FreeMode, Scrollbar]}
      slidesPerView="auto"
      freeMode
      scrollbar={{ draggable: true }}
      className="anime-tabs__swiper"
      onSwiper={(swiper: ISwiper) => {
        swiperRef.current = swiper;
      }}
      role="tablist"
      aria-orientation="horizontal">
      {tabs.map((tab, index) => (
        <SwiperSlide
          key={tab.value}
          className={activeTab === tab.value ? 'anime-tabs__slide--active' : ''}>
          <div
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            className="anime-tabs__trigger"
            role="tab"
            tabIndex={activeTab === tab.value ? 0 : -1}
            aria-selected={activeTab === tab.value}
            data-value={tab.value}
            onClick={onTabTriggerClick}
            onKeyDown={(e) => handleKeyDown(e, index)}>
            {tab.value.charAt(0).toUpperCase() + tab.value.slice(1)}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
});
