import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { AsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';
import { useAppSelector } from '@/app/hooks';
import { Anime, Manga } from '@/models';
import { FetchStatus } from '@/typescript';
import { useAbortableDispatch, useFetchStatus } from '@/hooks';
import { getUniqueItems } from '@/utils';
import { EmptyValueMessage, SectionHeader, SectionHeaderProps } from '@/components';
import { animeEmptyValueMessages, commonMessages, mangaEmptyValueMessages } from '@/variables';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import arrowIcon from '@/assets/arrow.svg';

import clsx from 'clsx';
import './MediaBlock.scss';

interface MediaBlockProps<T extends Anime | Manga> {
  type: T extends Anime ? 'anime' : 'manga';
  header: SectionHeaderProps;
  subtitle?: string;
  selector: (state: RootState) => { items: T[]; status: FetchStatus | null };
  renderCard: (item: T) => React.ReactNode;
  fetchAction?: AsyncThunk<T[], any, any>;
}

function MediaBlock<T extends Anime | Manga>({
  type,
  header,
  subtitle,
  selector,
  fetchAction,
  renderCard,
}: MediaBlockProps<T>) {
  const abortableDispatch = useAbortableDispatch();
  const { items, status } = useAppSelector(selector);
  const { isLoading, isSuccess, isError } = useFetchStatus(status);

  React.useEffect(() => {
    if (fetchAction && items.length === 0) abortableDispatch(fetchAction);
  }, []);

  return (
    <section className="chapter">
      <div className="chapter__container container">
        <SectionHeader
          className={clsx('chapter__header', header.className)}
          title={header.title}
          link={header.link}
        />
        <div className="chapter__body">
          <h3 className="chapter__sub-title title title--fz-24 title--main-color">{subtitle}</h3>
          {isLoading || (isSuccess && items.length > 0) ? (
            <Swiper
              tag="section"
              className="chapter__slider"
              wrapperClass="chapter__wrapper"
              modules={[Navigation]}
              slidesPerView="auto"
              slidesPerGroup={1}
              speed={800}
              breakpoints={{
                0: { spaceBetween: 12 },
                480: { spaceBetween: 15 },
                1024: { spaceBetween: 20 },
              }}
              navigation={{
                prevEl: '.chapter__button--prev',
                nextEl: '.chapter__button--next',
              }}>
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <SwiperSlide key={i} className="chapter__slide">
                      <Skeleton className="chapter__card _skeleton border-opacity" />
                    </SwiperSlide>
                  ))
                : getUniqueItems(items).map((item, i) => (
                    <SwiperSlide key={i} className="chapter__slide">
                      {renderCard(item)}
                    </SwiperSlide>
                  ))}
              <button type="button" className="chapter__button chapter__button--prev">
                <img src={arrowIcon} alt="Prev slides" />
              </button>
              <button type="button" className="chapter__button chapter__button--next">
                <img src={arrowIcon} alt="Next slides" />
              </button>
            </Swiper>
          ) : (
            <EmptyValueMessage
              message={
                isError
                  ? commonMessages.error
                  : type === 'anime'
                  ? animeEmptyValueMessages.items
                  : mangaEmptyValueMessages.items
              }
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default MediaBlock;
