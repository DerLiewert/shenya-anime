import React from 'react';
import { useAppSelector } from '@/app/hooks';

import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/scss';
import 'swiper/scss/effect-fade';
import 'swiper/scss/autoplay';

import clsx from 'clsx';
import './Intro.scss';

import IntroSlide, { IntroSlideSkeleton } from './IntroSlide';
import { uniqueAnime } from '@/utils';
import { FetchStatus } from '@/types';
import { useAbortableDispatch } from '@/hooks';
import { fetchIntroAnime } from '@/store/anime/introAnimeSlice';

const Intro: React.FC = () => {
  const { items, status } = useAppSelector((state) => state.introAnime);
  useAbortableDispatch(fetchIntroAnime, undefined, items.length === 0);

  return (
    <div className="intro">
      {status === FetchStatus.LOADING ? (
        <IntroSlideSkeleton />
      ) : (
        <Swiper
          tag="section"
          className="intro__slider"
          wrapperClass="intro__wrapper"
          modules={[EffectFade, Autoplay, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          speed={800}
          loop={true}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          autoHeight={true}
          lazyPreloadPrevNext={1}
          // autoplay={{
          //   delay: 5000,
          // }}
          pagination={{ clickable: true }}>
          <ResizeHeightFixer />
          {uniqueAnime(items)
            .slice(0, 10)
            .map((item) => (
              <SwiperSlide
                key={item.mal_id}
                className={clsx('slide', 'intro__slide swiper-slide-visible')}>
                <IntroSlide item={item} />
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

export default Intro;
