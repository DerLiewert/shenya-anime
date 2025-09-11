import { useAppSelector } from '@/app/hooks';
import { BroadcastItem, EmptyValueMessage, Pagination } from '@/components';
import { useAbortableDispatch, useAppNavigate, useFetchStatus } from '@/hooks';
import { schedulesFilter, SchedulesFilter, SchedulesParams } from '@/models';
import { fetchSchedulesAnime } from '@/store/anime/schedulesAnimeSlice';
import { scrollToTop, getUniqueItems } from '@/utils';
import { animeEmptyValueMessages, commonMessages, weekDaysOptions } from '@/variables';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { useLocation } from 'react-router-dom';
import Select from 'react-select';
import isEqual from 'lodash.isequal';
import './Broadcast.scss';

function parseSearchParams(search: string): Partial<SchedulesParams> {
  const params = new URLSearchParams(search);
  const result: Partial<SchedulesParams> = {};

  for (const [key, value] of params.entries()) {
    switch (key) {
      case 'filter':
        if (schedulesFilter.includes(value as SchedulesFilter)) {
          result.filter = value as SchedulesFilter;
        }
        break;
      case 'page':
        const page = parseInt(value, 10);
        if (!isNaN(page)) {
          (result as any)[key] = page;
        }
        break;
      default:
        break;
    }
  }

  return result;
}

function Broadcast() {
  const broadcastRef = React.useRef<HTMLDivElement>(null);

  const abortableDispatch = useAbortableDispatch();
  const appNavigate = useAppNavigate(parseSearchParams);
  const location = useLocation();
  const { items, status, pagination } = useAppSelector((state) => state.schedulesAnime);
  const { isError, isLoading, isSuccess } = useFetchStatus(status);

  const [searchParams, setSearchParams] = React.useState(getSearchParams());

  function getSearchParams() {
    const urlParams = parseSearchParams(location.search);
    const day = weekDaysOptions.find((obj) => obj.value === schedulesFilter[new Date().getDay()]);
    return { filter: day ? day.value : weekDaysOptions[0].value, ...urlParams };
  }

  React.useEffect(() => {
    appNavigate(searchParams, { replace: true });
    abortableDispatch(fetchSchedulesAnime, searchParams);
  }, []);

  React.useEffect(() => {
    const newParams = getSearchParams();
    if (!isEqual(searchParams, newParams)) {
      setSearchParams(newParams);
      abortableDispatch(fetchSchedulesAnime, newParams);
    }
  }, [location.search]);

  return (
    <div className="broadcast" ref={broadcastRef}>
      <div className="broadcast__filter">
        <Select
          className="broadcast__select select"
          classNamePrefix="select"
          placeholder="Select day of week..."
          defaultValue={weekDaysOptions[0]}
          value={weekDaysOptions.find((obj) => obj.value === searchParams.filter)}
          options={weekDaysOptions}
          onChange={(selected) => {
            if (selected) appNavigate({ ...searchParams, filter: selected.value, page: undefined });
          }}
          menuPortalTarget={document.body}
          isSearchable={false}
          unstyled
        />
      </div>
      <div className="broadcast__items">
        {isLoading ? (
          Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="broadcast__item border-opacity _skeleton" />
          ))
        ) : isSuccess ? (
          getUniqueItems(items).map((item) => (
            <BroadcastItem key={item.mal_id} className="broadcast__item" item={item} />
          ))
        ) : (
          <EmptyValueMessage
            message={isError ? commonMessages.error : animeEmptyValueMessages.newEpisodes}
          />
        )}
      </div>
      {pagination && (
        <Pagination
          currentPage={pagination.current_page}
          totalItems={pagination.items.total}
          itemsPerPage={pagination.items.per_page}
          className="catalog-cards__pagination"
          onChangePage={(page) => {
            appNavigate({ ...searchParams, page: page > 1 ? page : undefined });
            scrollToTop(broadcastRef);
          }}
        />
      )}
    </div>
  );
}

export default Broadcast;
