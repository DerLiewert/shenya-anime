import React from 'react';
import Select from 'react-select';
import isEqual from 'lodash.isequal';
import Skeleton from 'react-loading-skeleton';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useAbortableDispatch, useAppNavigate, useFetchStatus } from '@/hooks';
import { fetchSeasonsList, fetchSeasonsAnime } from '@/store';
import { animeEmptyValueMessages, commonMessages } from '@/constants';
import { getSeasonName, getUniqueItems, parseSeasonAnimeParams, scrollToTop } from '@/utils';
import { seasonOptions } from '@/resources';
import { AnimeCard, EmptyValueMessage, Pagination } from '@/components';
import { animeSeasons, JikanSeasonsPlusParams } from '@/typescript';
import './Seasonal.scss';

function getDefaultSeasonParams(): JikanSeasonsPlusParams {
  const fullDate = new Date();
  const currentMonth = fullDate.getMonth();
  const currentYear = fullDate.getFullYear();

  return {
    year: currentMonth === 11 ? currentYear + 1 : currentYear,
    season: getSeasonName(),
  };
}

export const Seasonal = () => {
  const seasonalRef = React.useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const abortableDispatch = useAbortableDispatch();
  const location = useLocation();

  const seasonsList = useAppSelector((state) => state.seasonsList.items);
  const seasonsFetchStatus = useFetchStatus((state) => state.seasonsList.status, true);

  const { items, pagination, status } = useAppSelector((state) => state.seasonsAnime);
  const { isLoading, isSuccess, isError } = useFetchStatus(status);

  const defaultParamsRef = React.useRef<JikanSeasonsPlusParams>(getDefaultSeasonParams());

  const yearOptions = React.useMemo(
    () => seasonsList.map((obj) => ({ value: obj.year, label: obj.year })),
    [seasonsList],
  );

  const parseSearchParams = React.useMemo(
    () =>
      parseSeasonAnimeParams({
        allAllowed: false,
        rules: {
          season: { include: animeSeasons },
          year:
            seasonsList.length > 0
              ? {
                  include: {
                    from: seasonsList[seasonsList.length - 1].year,
                    to: seasonsList[0].year,
                  },
                }
              : true,
          page: pagination?.last_visible_page
            ? { include: { from: 1, to: pagination.last_visible_page } }
            : { include: { from: 1 } },
        },
      }),
    [pagination?.last_visible_page, seasonsList],
  );

  const appNavigate = useAppNavigate(parseSearchParams);
  const [searchParams, setSearchParams] = React.useState<JikanSeasonsPlusParams>({
    ...defaultParamsRef.current,
    ...parseSearchParams(location.search),
  });

  React.useEffect(() => {
    if (!seasonsFetchStatus.isSuccess && !seasonsFetchStatus.isLoading)
      dispatch(fetchSeasonsList());
  }, []);

  React.useEffect(() => {
    const urlParams = parseSearchParams(location.search);
    const mergedParams = {
      ...defaultParamsRef.current,
      ...urlParams,
    };

    appNavigate(mergedParams, { replace: true });

    if (!isEqual(searchParams, mergedParams)) {
      setSearchParams(mergedParams);
    }
  }, [appNavigate, parseSearchParams, location.search]);

  React.useEffect(() => {
    abortableDispatch(fetchSeasonsAnime, { params: { ...searchParams, limit: 24 } });
  }, [searchParams]);

  return (
    <div className="seasonal" ref={seasonalRef}>
      <div className="seasonal__filter">
        {seasonsFetchStatus.isSuccess ? (
          <Select
            className="seasonal__select select"
            classNamePrefix="select"
            placeholder="Select year..."
            defaultValue={yearOptions[0]}
            value={yearOptions.find((obj) => obj.value === searchParams.year)}
            options={yearOptions}
            onChange={(selected) => {
              if (selected) appNavigate({ ...searchParams, year: selected.value, page: undefined });
            }}
            menuPortalTarget={document.body}
            isSearchable={false}
            unstyled
          />
        ) : (
          <Skeleton className="select__control" containerClassName="select seasonal__select" />
        )}

        {seasonOptions && seasonOptions.length > 0 && (
          <Select
            className="seasonal__select select"
            classNamePrefix="select"
            placeholder="Select season..."
            defaultValue={seasonOptions[0]}
            value={seasonOptions.find((obj) => obj.value === searchParams.season)}
            options={seasonOptions}
            onChange={(selected) => {
              if (selected)
                appNavigate({ ...searchParams, season: selected.value, page: undefined });
            }}
            menuPortalTarget={document.body}
            isSearchable={false}
            unstyled
          />
        )}
      </div>
      <div className="seasonal__items ">
        {isLoading ? (
          Array.from({ length: 24 }).map((_, i) => (
            <Skeleton
              key={i}
              containerClassName="seasonal__card _skeleton-container border-opacity"
              className="_skeleton "
            />
          ))
        ) : isSuccess ? (
          getUniqueItems(items).map((item) => <AnimeCard item={item} key={item.mal_id} />)
        ) : (
          <EmptyValueMessage
            message={isError ? commonMessages.error : animeEmptyValueMessages.seasonal}
          />
        )}
      </div>
      {pagination && (
        <Pagination
          className="seasonal__pagination"
          currentPage={pagination.current_page}
          totalItems={pagination.items.total}
          itemsPerPage={pagination.items.per_page}
          onChangePage={(page) => {
            appNavigate({ ...searchParams, page: page > 1 ? page : undefined });
            scrollToTop(seasonalRef);
          }}
        />
      )}
    </div>
  );
};
