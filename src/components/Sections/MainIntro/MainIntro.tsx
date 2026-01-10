import React from 'react';
import clsx from 'clsx';
import { useAppSelector } from '@/app/hooks';
import { useAbortableDispatch, useFetchStatus } from '@/hooks';
import { fetchIntroAnime } from '@/store';
import { getUniqueItems } from '@/utils';
import { MainIntroSlide, MainIntroSkeleton } from './MainIntroSlide';

import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import type { Swiper as ISwiper } from 'swiper';
import 'swiper/scss';
import 'swiper/scss/effect-fade';
import 'swiper/scss/autoplay';

import mainBg from '@/assets/bg/main-bg.jpg';
import './MainIntro.scss';

export const MainIntro: React.FC = () => {
  const abortableDispatch = useAbortableDispatch();
  const { items, status } = useAppSelector((state) => state.topAnime);
  const { isLoading, isSuccess, isError } = useFetchStatus(status);
  const uniqueItems = React.useMemo(() => getUniqueItems(items).slice(0, 10), [items]);

  // Из-за EffectFade изображения на всех слайдах сразу подгружаются. Фикс, типа lazy-loading
  const [loadedSlides, setLoadedSlides] = React.useState<Set<number>>(new Set());

  const onSlideChange = (index: number) => {
    const total = uniqueItems.length;
    if (total === loadedSlides.size) return;

    const prev = (index - 1 + total) % total;
    const next = (index + 1) % total;

    setLoadedSlides((prevState) => {
      if (prevState.has(index) && prevState.has(prev) && prevState.has(next)) return prevState;
      return new Set([...prevState, index, prev, next]);
    });
  };

  React.useEffect(() => {
    if (items.length === 0) abortableDispatch(fetchIntroAnime);
  }, []);

  if (isError || (isSuccess && items.length === 0))
    return (
      <div className="main-intro">
        <div className="main-intro__preview main-preview bg">
          <div className="main-preview__image">
            <img src={mainBg} alt="Main background" aria-hidden loading="lazy" />
          </div>
          <div className="container">
            <div className="main-preview__content">
              <h1 className="main-preview__title fz-48">
                Discover your next <span>Anime</span> adventure
              </h1>
              <p className="main-preview__text fz-18">
                Your ultimate source for everything anime! Discover reviews, the latest
                recommendations, fan-favorite characters, and exciting news and trivia. Dive into
                the world of anime with us and find your next favorite series to enjoy!
              </p>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="main-intro">
      {isLoading ? (
        <MainIntroSkeleton />
      ) : (
        <Swiper
          tag="section"
          className="main-intro__slider"
          wrapperClass="main-intro__wrapper"
          modules={[EffectFade, Autoplay, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          autoHeight={true}
          speed={800}
          loop={true}
          autoplay={{ delay: 3500 }}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          pagination={{ clickable: true }}
          onRealIndexChange={(swiper: ISwiper) => onSlideChange(swiper.realIndex)}
          onInit={(swiper: ISwiper) => onSlideChange(swiper.realIndex)}>
          <ResizeHeightFixer />
          {uniqueItems.map((item, index) => (
            <SwiperSlide key={item.mal_id} className={clsx('main-slide', 'main-intro__slide')}>
              <MainIntroSlide item={item} shouldRenderImage={loadedSlides.has(index)} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

const ResizeHeightFixer = () => {
  const swiper = useSwiper();

  React.useEffect(() => {
    const handleResize = () => {
      swiper.updateAutoHeight();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [swiper]);

  return null;
};
