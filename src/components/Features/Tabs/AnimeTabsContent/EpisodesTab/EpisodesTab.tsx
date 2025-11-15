import React from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useAbortableDispatch, useShowMore, useFetchStatus } from '@/hooks';
import { EmptyValueMessage, EpisodeItem, Loading } from '@/components';
import { animeEmptyValueMessages, commonMessages } from '@/constants';
import { fetchAnimeEpisodes } from '@/store';
import './EpisodesTab.scss';

const EpisodesTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const abortableDispatch = useAbortableDispatch();
  const { data: episodes, pagination } = useAppSelector((state) => state.animeFullById.episodes);
  const { isLoading, isSuccess, isError } = useFetchStatus(
    (state) => state.animeFullById.status.episodes,
  );
  const { visibleCount, showMore } = useShowMore(20);

  const fetchEpisodes = () => {
    if (pagination && episodes.length < visibleCount && pagination.has_next_page) {
      dispatch(
        fetchAnimeEpisodes({
          page: pagination.current_page ? pagination.current_page + 1 : undefined,
        }),
      );
    }
  };

  React.useEffect(() => {
    if (episodes.length === 0 && !isSuccess) abortableDispatch(fetchAnimeEpisodes, { page: 1 });
  }, []);

  React.useEffect(() => {
    fetchEpisodes();
  }, [visibleCount]);

  return (
    <div className="anime-episodes">
      {episodes.length > 0 && (
        <div className="anime-episodes__items tab-grid-2">
          {episodes.slice(0, visibleCount).map((episode) => (
            <EpisodeItem key={episode.mal_id} episode={episode} />
          ))}
        </div>
      )}

      {isLoading && <Loading className="anime-episodes__message" />}
      {isError && (
        <EmptyValueMessage className="anime-episodes__message" message={commonMessages.error} />
      )}
      {isSuccess && episodes.length === 0 && (
        <EmptyValueMessage
          className="anime-episodes__message"
          message={animeEmptyValueMessages.episodes}
        />
      )}

      {episodes.length > 0 && (episodes.length > visibleCount || pagination?.has_next_page) && (
        <div className="anime-episodes__show-more-wrapper bnts-wrapper">
          <button
            className="anime-episodes__show-more show-more-btn btn btn--upper btn--outline"
            onClick={isError ? fetchEpisodes : showMore}
            disabled={isLoading}>
            Show more
          </button>
        </div>
      )}
    </div>
  );
};

export default EpisodesTab;
