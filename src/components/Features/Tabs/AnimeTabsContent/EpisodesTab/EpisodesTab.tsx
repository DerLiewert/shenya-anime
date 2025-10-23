import React from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useAbortableDispatch, useShowMore, useFetchStatus } from '@/hooks';
import { fetchAnimeEpisodes } from '@/store/anime/animeFullByIdSlice';
import { AnimeEpisode } from '@/models';
import { formattedScore } from '@/utils';
import { EmptyValueMessage, Loading, StarIcon } from '@/components';
import './EpisodesTab.scss';
import { animeEmptyValueMessages, commonMessages, specialStatus } from '@/constants';

const EpisodesTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const abortableDispatch = useAbortableDispatch();
  const { data: episodes, pagination } = useAppSelector((state) => state.animeFullById.episodes);
  const { isLoading, isSuccess, isError } = useFetchStatus(
    (state) => state.animeFullById.status.episodes,
  );
  const { visibleCount, showMore } = useShowMore(20);

  React.useEffect(() => {
    if (episodes.length === 0 && !isSuccess) abortableDispatch(fetchAnimeEpisodes, {page: 1});
  }, []);

  React.useEffect(() => {
    if (pagination && episodes.length < visibleCount && pagination.has_next_page) {
      dispatch(
        fetchAnimeEpisodes({
          page: pagination.current_page ? pagination.current_page + 1 : undefined,
        }),
      );
    }
  }, [visibleCount]);

  if (isLoading && episodes.length === 0) return <Loading />;

  return (
    <div className="anime-episodes">
      {(isSuccess || isLoading) && episodes.length > 0 ? (
        <div className="anime-episodes__items tab-grid-2">
          {episodes.slice(0, visibleCount).map((episode) => (
            <EpisodeItem key={episode.mal_id} episode={episode} />
          ))}
        </div>
      ) : (
        <EmptyValueMessage
          message={isError ? commonMessages.error : animeEmptyValueMessages.episodes}
        />
      )}

      {isLoading && <Loading />}

      {episodes.length > 0 && (episodes.length > visibleCount || pagination?.has_next_page) && (
        <div className="anime-episodes__show-more-wrapper bnts-wrapper">
          <button
            className="anime-episodes__show-more show-more-btn btn btn--upper btn--outline"
            onClick={showMore}
            disabled={isLoading}>
            Show more
          </button>
        </div>
      )}
    </div>
  );
};

export default EpisodesTab;

/* ==================================
============ EpisodeItem ============ 
================================== */
const EpisodeItem: React.FC<{ episode: AnimeEpisode }> = ({ episode }) => {
  return (
    <div className="anime-episodes__item episode-item border">
      <div className="episode-item__top">
        <span className="episode-item__label">EP: {episode.mal_id}</span>
        {(episode.recap || episode.filler) && (
          <p className="episode-item__labels">
            {episode.recap && <span className="episode-item__label _recap">Recap</span>}
            {episode.filler && <span className="episode-item__label _filler">Filler</span>}
          </p>
        )}
      </div>
      <div className="episode-item__content">
        <h3 className="episode-item__title visible-line" title={episode.title}>
          {episode.title}
        </h3>
        {episode.title_japanese && (
          <h4 className="episode-item__sub-title visible-line" title={episode.title_japanese}>
            {episode.title_japanese}
          </h4>
        )}
      </div>
      <div className="episode-item__bottom">
        <div className="episode-item__date">
          {episode.aired ? episode.aired.split('T')[0] : specialStatus.unknown}
        </div>
        <div className="episode-item__score">
          <StarIcon />
          <p>
            {formattedScore(episode.score)}
            <span>/ 5</span>
          </p>
        </div>
      </div>
    </div>
  );
};
