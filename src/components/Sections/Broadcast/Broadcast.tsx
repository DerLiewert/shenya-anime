import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { BroadcastItem, EmptyValueMessage, Loading } from '@/components';
import { useAbortableDispatch, useFetchStatus } from '@/hooks';
import { SchedulesFilter } from '@/models';
import { fetchSchedulesAnime } from '@/store/anime/schedulesAnimeSlice';
import { uniqueItems } from '@/utils';
import { animeEmptyValueMessages, commonMessages, WEEK_DAYS } from '@/variables';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import Select from 'react-select';
import './Broadcast.scss';

export const schedulesFilter: SchedulesFilter[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

const weekDaysOptions: { value: SchedulesFilter; label: string }[] = [
  { value: schedulesFilter[0], label: WEEK_DAYS[0] },
  { value: schedulesFilter[1], label: WEEK_DAYS[1] },
  { value: schedulesFilter[2], label: WEEK_DAYS[2] },
  { value: schedulesFilter[3], label: WEEK_DAYS[3] },
  { value: schedulesFilter[4], label: WEEK_DAYS[4] },
  { value: schedulesFilter[5], label: WEEK_DAYS[5] },
  { value: schedulesFilter[6], label: WEEK_DAYS[6] },
];

function Broadcast() {
  const dispatch = useAppDispatch();
  const prevDay = useAppSelector((state) => state.schedulesAnime.day);
  const items = useAppSelector((state) => state.schedulesAnime.items);
  const pagination = useAppSelector((state) => state.schedulesAnime.pagination);
  const status = useAppSelector((state) => state.schedulesAnime.status);
  const { isError, isIdle, isLoading, isSuccess } = useFetchStatus(status);
  const [day, setDay] = React.useState(weekDaysOptions[0]);

  const param = React.useMemo(() => ({ day: day.value, page: 1 }), [day.value]);
  useAbortableDispatch(fetchSchedulesAnime, param, isLoading || prevDay !== day.value);

  const renderSkeletons = () =>
    Array.from({ length: 12 }).map((_, i) => (
      <Skeleton key={i} className="broadcast__item border-opacity _skeleton" />
    ));

  const renderItems = () =>
    uniqueItems(items).map((item) => (
      <BroadcastItem key={item.mal_id} className="broadcast__item" item={item} />
    ));

  const renderEmpty = () => (
    <EmptyValueMessage
      message={isError ? commonMessages.error : animeEmptyValueMessages.newEpisodes}
    />
  );

  const onShowMore = () => {
    if (pagination && pagination.has_next_page) {
      dispatch(
        fetchSchedulesAnime({
          day: day.value,
          page: pagination.current_page + 1,
        }),
      );
    }
  };
  return (
    <div className="broadcast">
      <div className="broadcast__filter">
        <Select
          className="broadcast__select select"
          classNamePrefix="select"
          placeholder=""
          defaultValue={weekDaysOptions[0]}
          value={day}
          options={weekDaysOptions}
          onChange={(selected) => {
            setDay(selected as any);
          }}
          menuPortalTarget={document.body}
          isSearchable={false}
          unstyled
        />
      </div>
      <div className="broadcast__items">
        { renderItems()}
        {/* {isLoading ? renderSkeletons() : isSuccess ? renderItems() : renderEmpty()} */}
      </div>
      {isLoading && <Loading />}
      {items.length > 0 && pagination?.has_next_page && (
        <div className="broadcast__show-more-wrapper bnts-wrapper">
          <button
            className="broadcast__show-more show-more-btn btn btn--upper btn--outline"
            onClick={onShowMore}
            disabled={isLoading}>
            Show more
          </button>
        </div>
      )}
    </div>
  );
}

export default Broadcast;
