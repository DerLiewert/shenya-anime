import React from 'react';
import { useAppSelector } from '@/app/hooks';

import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import type { Swiper as ISwiper } from 'swiper';
import 'swiper/scss';
import 'swiper/scss/effect-fade';
import 'swiper/scss/autoplay';

import MainIntroSlide, { MainIntroSkeleton } from './MainIntroSlide';
import { uniqueItems } from '@/utils';
import { FetchStatus } from '@/typescript';
import { useAbortableDispatch } from '@/hooks';
import { fetchIntroAnime } from '@/store/anime/introAnimeSlice';

import clsx from 'clsx';
import './MainIntro.scss';

const MainIntro: React.FC = () => {
  const abortableDispatch = useAbortableDispatch();
  const { items, status } = useAppSelector((state) => state.introAnime);

  const [realIndex, setRealIndex] = React.useState(0);

  const shouldRenderImage = (index: number) => {
    if (index === realIndex) return true;

    const total = items.length;
    const prev = (realIndex - 1 + total) % total;
    const next = (realIndex + 1) % total;
    return index === prev || index === next;
  };

  React.useEffect(() => {
    if (items.length === 0) abortableDispatch(fetchIntroAnime);
  }, []);

  return (
    <div className="main-intro">
      {status === FetchStatus.LOADING ? (
        <MainIntroSkeleton />
      ) : (
        <Swiper
          tag="section"
          className="main-intro__slider"
          wrapperClass="main-intro__wrapper"
          modules={[EffectFade, Autoplay, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          speed={800}
          loop={true}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          autoHeight={true}
          onRealIndexChange={(swiper: ISwiper) => setRealIndex(swiper.realIndex)}
          pagination={{ clickable: true }}>
          <ResizeHeightFixer />
          {uniqueItems(items)
            .slice(0, 10)
            .map((item, index) => (
              <SwiperSlide key={item.mal_id} className={clsx('main-slide', 'main-intro__slide')}>
                <MainIntroSlide item={item} shouldRenderImage={shouldRenderImage(index)} />
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

export default MainIntro;
