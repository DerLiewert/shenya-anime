import React from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useAbortableDispatch, useShowMore } from '@/hooks';
import { fetchAnimeNews } from '@/store/anime/animeFullByIdSlice';
import './NewsTab.scss';
import { EmptyValueMessage, Loading } from '@/components';
import { animeEmptyValueMessages } from '@/variables/emptyValueMessages';
import { useFetchStatus } from '@/hooks/useFetchStatus';

const NewsTab: React.FC<{ id: number }> = ({ id }) => {
  const dispatch = useAppDispatch();
  const { data: news, pagination } = useAppSelector((state) => state.animeFullById.news);
  const { isLoading, isSuccess } = useFetchStatus((state) => state.animeFullById.status.news);
  const { visibleCount, showMore } = useShowMore(6);

  const memoizedPayload = React.useMemo(() => ({ id }), [id]);
  useAbortableDispatch(fetchAnimeNews, memoizedPayload, news.length === 0 && !isSuccess);

  React.useEffect(() => {
    if (pagination && news.length < visibleCount && pagination.has_next_page) {
      dispatch(
        fetchAnimeNews({
          id,
          page: pagination.current_page ? pagination.current_page + 1 : undefined,
        }),
      );
    }
  }, [visibleCount]);

  return (
    <>
      {isLoading && news.length === 0 ? (
        <Loading />
      ) : (
        <div className="anime-news">
          {(isSuccess || isLoading) && news.length > 0 ? (
            <div className="anime-news__items">
              {news.slice(0, visibleCount).map((obj) => (
                <a
                  key={obj.mal_id}
                  className="anime-news__item news-item border"
                  href={obj.url}
                  target="_blank">
                  <div className="news-item__image bg bg--dark border-radius">
                    <img src={obj.images.jpg.image_url} alt="News poster" aria-hidden />
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
            <EmptyValueMessage message={animeEmptyValueMessages.news} />
          )}
          {isLoading && <Loading />}
          {news.length > 0 && (news.length > visibleCount || pagination?.has_next_page) && (
            <div className="anime-news__show-more-wrapper bnts-wrapper">
              <button
                className="anime-news__show-more show-more-btn btn btn--upper btn--outline"
                onClick={showMore}
                disabled={isLoading}>
                Show more
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default NewsTab;
