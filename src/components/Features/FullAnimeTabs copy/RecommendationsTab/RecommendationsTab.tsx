import React from 'react';
import { useAppSelector } from '@/app/hooks';
import { useAbortableDispatch, useFetchStatus, useShowMore } from '@/hooks';
import { Anime } from '@/models';
import { fetchAnimeRecommendations } from '@/store/anime/animeFullByIdSlice';
import { getImageUrl } from '@/utils';

import './RecommendationsTab.scss';
import { Link } from 'react-router-dom';
import { RecommendationAnimeCard } from '@/components/Common/CardItem/CardItem';
import { AnimeTooltip } from '@/components/Common';
import { EmptyValueMessage, Loading } from '@/components/UI';
import { animeEmptyValueMessages } from '@/variables';

const RecommendationsTab: React.FC<{ id: number }> = React.memo(({ id }) => {
  const { recommendations, status } = useAppSelector((state) => state.animeFullById);
  const { isLoading, isSuccess } = useFetchStatus(status.recommendations);
  const { visibleCount, showMore } = useShowMore(12);

  useAbortableDispatch(fetchAnimeRecommendations, id, recommendations.length === 0 && !isSuccess);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="anime-recommendations">
          {isSuccess && recommendations.length > 0 ? (
            <div className="anime-recommendations__items ">
              {recommendations.slice(0, visibleCount).map((item) => (
                <AnimeTooltip id={item.entry.mal_id} key={item.entry.mal_id}>
                  <RecommendationAnimeCard
                    item={item.entry}
                    className="anime-recommendations__item"
                  />
                </AnimeTooltip>
              ))}
            </div>
          ) : (
            <EmptyValueMessage message={animeEmptyValueMessages.recommendations} />
          )}
          {recommendations.length > 0 && recommendations.length > visibleCount && (
            <div className="anime-recommendations__show-more-wrapper bnts-wrapper">
              <button
                className="anime-recommendations__show-more show-more-btn btn btn--upper btn--outline"
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
});

export default RecommendationsTab;
