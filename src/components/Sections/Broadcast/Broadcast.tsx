import React from 'react';
import Skeleton from 'react-loading-skeleton';
import Select from 'react-select';
import isEqual from 'lodash.isequal';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import { fetchSchedulesAnime } from '@/store';
import { useAbortableDispatch, useAppNavigate, useFetchStatus } from '@/hooks';
import { animeEmptyValueMessages, commonMessages } from '@/constants';
import { scrollToTop, getUniqueItems, parseBroadcastAnimeParams } from '@/utils';
import { weekDaysOptions } from '@/resources';
import { BroadcastItem, EmptyValueMessage, Pagination } from '@/components';
import { schedulesFilter } from '@/typescript';

import './Broadcast.scss';

const Broadcast = () => {
  const broadcastRef = React.useRef<HTMLDivElement>(null);

  const abortableDispatch = useAbortableDispatch();
  const location = useLocation();
  const { items, status, pagination } = useAppSelector((state) => state.schedulesAnime);
  const { isLoading, isSuccess, isError } = useFetchStatus(status);

  const parseSearchParams = React.useMemo(
    () =>
      parseBroadcastAnimeParams({
        allAllowed: false,
        rules: {
          filter: true,
          page: pagination?.last_visible_page
            ? { include: { from: 1, to: pagination.last_visible_page } }
            : true,
        },
      }),
    [pagination?.last_visible_page],
  );

  const appNavigate = useAppNavigate(parseSearchParams);
  const [searchParams, setSearchParams] = React.useState(getSearchParams());

  function getSearchParams() {
    const urlParams = parseSearchParams(location.search);
    const day = weekDaysOptions.find((obj) => obj.value === schedulesFilter[new Date().getDay()]);
    return { filter: day ? day.value : weekDaysOptions[0].value, ...urlParams };
  }

  React.useEffect(() => {
    appNavigate(searchParams, { replace: true });
    abortableDispatch(fetchSchedulesAnime, searchParams as any);
  }, []);

  React.useEffect(() => {
    const newParams = getSearchParams();
    if (!isEqual(searchParams, newParams)) {
      setSearchParams(newParams);
      abortableDispatch(fetchSchedulesAnime, newParams as any);
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
};

export default Broadcast;
