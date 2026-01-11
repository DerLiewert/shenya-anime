import React from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useAbortableDispatch, useShowMore } from '@/hooks';
import { commonMessages, mangaEmptyValueMessages } from '@/constants';
import { getImageUrl, isAppendItems } from '@/utils';
import { EmptyValueMessage, Loading } from '@/components';
import { useFetchStatus } from '@/hooks/useFetchStatus';

import type { AsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import type { AsyncThunkConfig } from '@/app/appAsyncThunk';
import type { FetchListArgs } from '@/store/_common';
import type { DataWithPagePagination, FetchStatus, StatusSelector, JikanNews } from '@/typescript';

import './NewsTab.scss';

interface NewsTabProps {
  status: StatusSelector | FetchStatus | undefined;
  newsSelector: (state: RootState) => DataWithPagePagination<JikanNews>;
  fetchAction: AsyncThunk<
    DataWithPagePagination<JikanNews>,
    FetchListArgs<{ page?: number }>,
    AsyncThunkConfig
  >;
  visibleNewsCount?: number;
}

export const NewsTab: React.FC<NewsTabProps> = ({
  newsSelector,
  status,
  fetchAction,
  visibleNewsCount = 6,
}) => {
  const dispatch = useAppDispatch();
  const abortableDispatch = useAbortableDispatch();
  const { data: news, pagination } = useAppSelector(newsSelector);
  const { isLoading, isSuccess, isError } = useFetchStatus(status);
  const { visibleCount, showMore } = useShowMore(visibleNewsCount);

  React.useEffect(() => {
    if (news.length === 0 && (!isSuccess || !isLoading)) {
      abortableDispatch(fetchAction, { params: { page: 1 } });
    }
  }, []);

  React.useEffect(() => {
    if (pagination && news.length < visibleCount && pagination.has_next_page) {
      const nextPage = pagination.current_page ? pagination.current_page + 1 : undefined;
      dispatch(
        fetchAction({
          params: { page: nextPage },
          append: isAppendItems(pagination.current_page, nextPage),
        }),
      );
    }
  }, [visibleCount]);

  return (
    <div className="news-tab">
      {news.length > 0 && (
        <div className="news-tab__items">
          {news.slice(0, visibleCount).map((obj) => (
            <a
              key={obj.mal_id}
              className="news-tab__item news-item border"
              href={obj.url}
              target="_blank"
              rel="noopener noreferrer">
              <div className="news-item__image bg bg--dark border-radius">
                <img src={getImageUrl(obj.images)} alt="News poster" aria-hidden />
              </div>
              <div className="news-item__content">
                <h3 className="news-item__title">{obj.title}</h3>
                <div className="news-item__info">
                  <div className="news-item__date">
                    {obj.date.split('T')[0]} / {obj.date.split('T')[1].slice(0, 5)}
                  </div>
                  <div className="news-item__author">by {obj.author_username}</div>
                </div>
                <p className="news-item__text">{obj.excerpt}</p>
              </div>
            </a>
          ))}
        </div>
      )}

      {isLoading && <Loading className="news-tab__message" />}
      {isError && (
        <EmptyValueMessage className="news-tab__message" message={commonMessages.error} />
      )}
      {isSuccess && news.length === 0 && (
        <EmptyValueMessage className="news-tab__message" message={mangaEmptyValueMessages.news} />
      )}

      {news.length > 0 && (news.length > visibleCount || pagination?.has_next_page) && (
        <div className="news-tab__show-more-wrapper bnts-wrapper">
          <button
            className="news-tab__show-more show-more-btn btn btn--upper btn--outline"
            onClick={showMore}
            disabled={isLoading}>
            Show more
          </button>
        </div>
      )}
    </div>
  );
};

