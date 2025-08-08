import React from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useAbortableDispatch, useShowMore } from '@/hooks';
import { EmptyValueMessage, Loading } from '@/components';
import { mangaEmptyValueMessages } from '@/variables/emptyValueMessages';
import { useFetchStatus } from '@/hooks/useFetchStatus';
import type { JikanNews } from '@/models';
import type { RootState } from '@/app/store';
import type { AsyncThunk } from '@reduxjs/toolkit';
import type {
  AsyncThunkConfig,
  DataWithExtendedBasicPagination,
  FetchStatus,
  StatusSelector,
} from '@/typescript';
import './NewsTab.scss';
import { getImageUrl } from '@/utils';

interface NewsTabProps {
  status: StatusSelector | FetchStatus | undefined;
  newsSelector: (state: RootState) => DataWithExtendedBasicPagination<JikanNews>;
  actionCreator: AsyncThunk<
    DataWithExtendedBasicPagination<JikanNews>,
    { page?: number },
    AsyncThunkConfig
  >;
  visibleNewsCount?: number;
}
const NewsTab = (props: NewsTabProps) => {
  const { newsSelector, status, actionCreator, visibleNewsCount = 6 } = props;

  const dispatch = useAppDispatch();
  const { data: news, pagination } = useAppSelector(newsSelector);
  const { isLoading, isSuccess } = useFetchStatus(status);
  const { visibleCount, showMore, reset } = useShowMore(visibleNewsCount);

  const param = React.useMemo(() => ({ page: 1 }), []);
  useAbortableDispatch(actionCreator, param, news.length === 0 && !isSuccess);

  React.useEffect(() => {
    if (pagination && news.length < visibleCount && pagination.has_next_page) {
      dispatch(
        actionCreator({
          page: pagination.current_page ? pagination.current_page + 1 : undefined,
        }),
      );
    }
    return () => reset();
  }, [visibleCount]);

  if (isLoading && news.length === 0) return <Loading />;

  return (
    <div className="news-tab">
      {(isSuccess || isLoading) && news.length > 0 ? (
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
      ) : (
        <EmptyValueMessage message={mangaEmptyValueMessages.news} />
      )}
      {isLoading && <Loading />}
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

export default NewsTab;
