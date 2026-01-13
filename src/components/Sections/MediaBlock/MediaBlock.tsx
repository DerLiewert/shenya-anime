import React from 'react';
import clsx from 'clsx';
import Skeleton from 'react-loading-skeleton';
import { AppAsyncThunk } from '@/app/appAsyncThunk';
import { RootState } from '@/app/store';
import { useAppSelector } from '@/app/hooks';
import { useAbortableDispatch, useFetchStatus } from '@/hooks';
import { ArrowIcon, EmptyValueMessage, SectionHeader, SectionHeaderProps } from '@/components';
import { animeEmptyValueMessages, commonMessages, mangaEmptyValueMessages } from '@/constants';
import { getUniqueItems } from '@/utils';
import { AnimeAndMangaOf, AnimeAndMangaType, FetchStatus, Nullable } from '@/typescript';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import './MediaBlock.scss';

interface MediaBlockProps<
  T extends AnimeAndMangaType,
  Item extends AnimeAndMangaOf<T> = AnimeAndMangaOf<T>,
> {
  type: T;
  header: SectionHeaderProps;
  subtitle?: string;
  selector: (state: RootState) => { items: Item[]; status: Nullable<FetchStatus> };
  renderCard: (item: Item) => React.ReactNode;
  fetchAction?: AppAsyncThunk<Item[]>;
}

export function MediaBlock<T extends AnimeAndMangaType>({
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
        <SectionHeader className={clsx('chapter__header', header.className)} {...header} />
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
              <button
                type="button"
                className="chapter__button chapter__button--prev"
                aria-label="Prev slides">
                <ArrowIcon />
              </button>
              <button
                type="button"
                className="chapter__button chapter__button--next"
                aria-label="Next slides">
                <ArrowIcon />
              </button>
            </Swiper>
          ) : (
            <EmptyValueMessage
              message={
                isError
                  ? commonMessages.error
                  : (type === 'anime' ? animeEmptyValueMessages : mangaEmptyValueMessages).items
              }
            />
          )}
        </div>
      </div>
    </section>
  );
}
