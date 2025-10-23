import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import { fetchTodaySchedulesAnime } from '@/store';
import { useAppSelector } from '@/app/hooks';
import { useAbortableDispatch, useFetchStatus } from '@/hooks';
import { ArrowIcon, BroadcastItem, EmptyValueMessage, SectionHeader } from '@/components';
import { animeEmptyValueMessages, commonMessages } from '@/constants';
import { getUniqueItems } from '@/utils';
import { appPaths } from '@/resources';
import './NewEpisodes.scss';

const NewEpisodes: React.FC = () => {
  const abortableDispatch = useAbortableDispatch();
  const { items, status } = useAppSelector((state) => state.todaySchedulesAnime);
  const { isLoading, isSuccess, isError } = useFetchStatus(status);
  const uniqueItems = React.useMemo(() => getUniqueItems(items), [items]);

  React.useEffect(() => {
    if (items.length === 0) abortableDispatch(fetchTodaySchedulesAnime);
  }, []);

  return (
    <div className="new-episodes">
      <div className="container">
        <SectionHeader
          className="new-episodes__section-header"
          title="New Episodes"
          link={{ url: appPaths.broadcast, text: 'View release calendar' }}
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
            uniqueItems.slice(0, 6).map((item) => <BroadcastItem item={item} key={item.mal_id} />)
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
                to={appPaths.broadcast}
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
