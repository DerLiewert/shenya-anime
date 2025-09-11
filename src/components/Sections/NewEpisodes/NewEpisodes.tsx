import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import { useAbortableDispatch, useFetchStatus } from '@/hooks';
import { fetchTodaySchedulesAnime } from '@/store/anime/todaySchedulesAnimeSlice';
import { ArrowIcon, BroadcastItem, EmptyValueMessage, SectionHeader } from '@/components';
import { animeEmptyValueMessages, commonMessages, commonPaths } from '@/variables';
import { getUniqueItems } from '@/utils';
import './NewEpisodes.scss';

const NewEpisodes: React.FC = () => {
  const abortableDispatch = useAbortableDispatch();
  const { items, status } = useAppSelector((state) => state.todaySchedulesAnime);
  const { isLoading, isSuccess, isError } = useFetchStatus(status);
  const uniqueItems = getUniqueItems(items);

  React.useEffect(() => {
    if (items.length === 0) abortableDispatch(fetchTodaySchedulesAnime);
  }, []);

  return (
    <div className="new-episodes">
      <div className="container">
        <SectionHeader
          className="new-episodes__section-header"
          title="New Episodes"
          link={{ url: commonPaths.broadcast, text: 'View release calendar' }}
        />
        <h3 className="new-episodes__sub-title title title--fz-24 title--main-color">Today</h3>
        <div className="new-episodes__body">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={i}
                className="new-episodes__item new-episode border-opacity _skeleton"
              />
            ))
          ) : isSuccess ? (
            uniqueItems.splice(0, 6).map((item) => <BroadcastItem item={item} key={item.mal_id} />)
          ) : (
            <EmptyValueMessage
              message={isError ? commonMessages.error : animeEmptyValueMessages.newEpisodes}
            />
          )}
        </div>

        {isLoading ? (
          <Skeleton className="new-episodes__btn-wrapper border-opacity _skeleton" />
        ) : (
          isSuccess &&
          uniqueItems.length > 6 && (
            <div className="new-episodes__btn-wrapper">
              <Link
                to={commonPaths.broadcast}
                className="new-episodes__btn btn btn--icon btn--upper btn--stroke show-more-btn">
                View more
                <ArrowIcon />
              </Link>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default NewEpisodes;