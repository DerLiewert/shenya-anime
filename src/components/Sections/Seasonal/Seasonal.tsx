import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useAbortableDispatch, useAppNavigate, useFetchStatus } from '@/hooks';
import { AnimeCard, Pagination } from '@/components';
import {
  AnimeSeason,
  animeSeasons,
  JikanSeasonsPlusParams,
  seasonAnimeType,
  SeasonAnimeType,
} from '@/models';
import { fetchSeasonsList } from '@/store/season/seasonListSlice';
import { fetchSeasonsAnime } from '@/store/season/seasonsAnimeSlice';
import { getSeasonName, scrollToTop, uniqueItems } from '@/utils';
import Select from 'react-select';
import isEqual from 'lodash.isequal';
import './Seasonal.scss';
import { seasonOptions } from '@/variables';

function parseSearchParams(search: string): Partial<JikanSeasonsPlusParams> {
  const params = new URLSearchParams(search);
  const result: Partial<JikanSeasonsPlusParams> = {};

  for (const [key, value] of params.entries()) {
    switch (key) {
      case 'year':
        const year = Number(value);
        if (!isNaN(year)) result.year = year;
        break;
      case 'season':
        if (animeSeasons.includes(value as AnimeSeason)) {
          result.season = value as AnimeSeason;
        }
        break;
      case 'filter':
        if (seasonAnimeType.includes(value as SeasonAnimeType)) {
          result.filter = value as SeasonAnimeType;
        }
        break;
      case 'page':
      case 'limit':
        const page = parseInt(value, 10);
        if (!isNaN(page)) {
          (result as any)[key] = page;
        }
        break;
      case 'continuing':
      case 'unapproved':
      case 'sfw':
        result[key] = value === 'true';
        break;
      default:
        break;
    }
  }

  const availableParams: Array<keyof JikanSeasonsPlusParams> = ['year', 'season', 'page'];

  for (const key in result) {
    if (!availableParams.includes(key as keyof JikanSeasonsPlusParams))
      delete result[key as keyof JikanSeasonsPlusParams];
  }

  return result;
}

const getDefaultParams = () => ({
  year: new Date().getFullYear(),
  season: getSeasonName(),
  page: 1,
});

// ===== Seasonal ===== //
function Seasonal() {
  const dispatch = useAppDispatch();
  const abortableDispatch = useAbortableDispatch();
  const location = useLocation();
  const appNavigate = useAppNavigate(parseSearchParams);

  const seasonsList = useAppSelector((state) => state.seasonsList.items);
  const { isSuccess: isSuccessSeasons } = useFetchStatus((state) => state.seasonsList.status);

  const { items, pagination, status } = useAppSelector((state) => state.seasonsAnime);
  const { isLoading: isLoadingItems } = useFetchStatus(status);

  const yearOptions = React.useMemo(
    () => seasonsList.map((obj) => ({ value: obj.year, label: obj.year })),
    [seasonsList],
  );

  const searchParams = React.useMemo<JikanSeasonsPlusParams>(() => {
    const urlParams = parseSearchParams(location.search);
    const defaultParams = getDefaultParams();
    return { ...defaultParams, ...urlParams };
  }, [location.search]);

  React.useEffect(() => {
    appNavigate(searchParams, { replace: true });
    if (isSuccessSeasons) return;
    dispatch(fetchSeasonsList());
  }, []);

  const prevParamsRef = React.useRef<JikanSeasonsPlusParams | null>(null);
  React.useEffect(() => {
    if (!prevParamsRef.current || !isEqual(prevParamsRef.current, searchParams)) {
      prevParamsRef.current = searchParams;
      abortableDispatch(fetchSeasonsAnime, searchParams);
    }
  }, [abortableDispatch, searchParams]);

  const cardsRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className="seasonal" ref={cardsRef}>
      <div className="seasonal__filter">
        {isSuccessSeasons ? (
          <Select
            className="seasonal__select select"
            classNamePrefix="select"
            placeholder="Select year..."
            defaultValue={yearOptions[0]}
            value={yearOptions.find((obj) => obj.value === searchParams.year)}
            options={yearOptions}
            onChange={(selected) => {
              // if (selected && selected.value !== searchParams.year)
              if (selected) appNavigate({ ...searchParams, year: selected.value, page: undefined });
            }}
            menuPortalTarget={document.body}
            isSearchable={false}
            unstyled
          />
        ) : (
          <Skeleton className="select__control " containerClassName="select seasonal__select" />
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
        {isLoadingItems
          ? Array.from({ length: 24 }).map((_, i) => (
              <Skeleton
                key={i}
                containerClassName="seasonal__card _skeleton-container border-opacity"
                className=" _skeleton "
              />
            ))
          : uniqueItems(items).map((item) => <AnimeCard item={item} key={item.mal_id} />)}
      </div>
      {pagination && (
        <Pagination
          className="seasonal__pagination"
          currentPage={pagination.current_page}
          totalItems={pagination.items.total}
          itemsPerPage={pagination.items.per_page}
          onChangePage={(page) => {
            appNavigate({ ...searchParams, page: page > 1 ? page : undefined });
            scrollToTop(cardsRef);
          }}
        />
      )}
    </div>
  );
}

export default Seasonal;
