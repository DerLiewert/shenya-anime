import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import { useAppSelector } from '../../../app/hooks';
import { RootState } from '../../../app/store';
import { Anime } from '../../../models';
import { AnimeTooltip, CardItem, ISectionHeaderProps, SectionHeader } from '../../Common';

import arrowIcon from '../../../assets/arrow.svg';

import clsx from 'clsx';
import './MediaBlock.scss';
import { uniqueAnime } from '@/utils';
import { FetchStatus } from '@/types';
import Skeleton from 'react-loading-skeleton';
import { EmptyValueMessage } from '@/components';
import { animeEmptyValueMessages, commonMessages } from '@/variables/emptyValueMessages';
import { AnimeCard } from '@/components/Common/CardItem/CardItem';

interface MediaBlockProps {
  header: ISectionHeaderProps;
  subtitle?: null | string;
  selectFunction: (state: RootState) => { items: Anime[]; status: FetchStatus };
}

const MediaBlock: React.FC<MediaBlockProps> = ({ header, subtitle, selectFunction }) => {
  const { items, status } = useAppSelector(selectFunction);

  const isLoading = status === FetchStatus.LOADING;
  const isSuccess = status === FetchStatus.SUCCESS && items.length > 0;
  const isError = status === FetchStatus.ERROR;

  const renderSkeletons = () =>
    Array.from({ length: 6 }).map((_, i) => (
      <SwiperSlide key={i} className="chapter__slide">
        <Skeleton className="chapter__card _skeleton border-opacity" />
      </SwiperSlide>
    ));

  const renderItems = () =>
    uniqueAnime(items).map((item) => (
      <SwiperSlide key={item.mal_id} className="chapter__slide">
        <AnimeTooltip item={item}>
          <AnimeCard item={item} className="chapter__card" />
        </AnimeTooltip>
      </SwiperSlide>
    ));

  const renderEmpty = () => (
    <EmptyValueMessage
      message={isError ? commonMessages.error : animeEmptyValueMessages.newEpisodes}
    />
  );

  return (
    <section className="chapter">
      <div className="chapter__container container">
        <SectionHeader
          className={clsx('chapter__header', header.className)}
          title={header.title}
          link={header.link}
        />
        <div className="chapter__body">
          {isLoading || isSuccess ? (
            <Swiper
              tag="section"
              className="chapter__slider"
              wrapperClass="chapter__wrapper"
              modules={[Navigation]}
              slidesPerView="auto"
              slidesPerGroup={1}
              speed={800}
              breakpoints={{
                0: {
                  spaceBetween: 12,
                },
                480: {
                  spaceBetween: 15,
                },
                1024: {
                  spaceBetween: 20,
                },
              }}
              navigation={{ prevEl: '.chapter__button--prev', nextEl: '.chapter__button--next' }}>
              {isLoading ? renderSkeletons() : renderItems()}
              <button type="button" className="chapter__button chapter__button--prev">
                <img src={arrowIcon} alt="Prev slides" />
              </button>
              <button type="button" className="chapter__button chapter__button--next">
                <img src={arrowIcon} alt="Next slides" />
              </button>
            </Swiper>
          ) : (
            renderEmpty()
          )}
        </div>
      </div>
    </section>
  );
};

export default MediaBlock;
