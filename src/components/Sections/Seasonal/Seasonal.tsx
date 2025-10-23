import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useAbortableDispatch, useAppNavigate, useFetchStatus } from '@/hooks';
import { AnimeCard, Pagination } from '@/components';
import { fetchSeasonsList, fetchSeasonsAnime } from '@/store';
import { getSeasonName, getUniqueItems, parseSeasonAnimeParams, scrollToTop } from '@/utils';
import { seasonOptions } from '@/resources';
import Select from 'react-select';
import isEqual from 'lodash.isequal';
import './Seasonal.scss';

const parseSearchParams = parseSeasonAnimeParams({
  allAllowed: false,
  rules: { year: true, season: true, page: true },
});

function Seasonal() {
  const seasonalRef = React.useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const abortableDispatch = useAbortableDispatch();
  const location = useLocation();
  const appNavigate = useAppNavigate(parseSearchParams);

  const { items: seasonsList, status: seasonsStatus } = useAppSelector(
    (state) => state.seasonsList,
  );
  const { isSuccess: isSuccessSeasons } = useFetchStatus(seasonsStatus);

  const { items, pagination, status } = useAppSelector((state) => state.seasonsAnime);
  const { isLoading: isLoadingItems } = useFetchStatus(status);

  const yearOptions = React.useMemo(
    () => seasonsList.map((obj) => ({ value: obj.year, label: obj.year })),
    [seasonsList],
  );

  const [searchParams, setSearchParams] = React.useState(getSearchParams());

  function getSearchParams() {
    const urlParams = parseSearchParams(location.search);
    const defaultParams = {
      year: new Date().getFullYear(),
      season: getSeasonName(),
      page: undefined,
    };
    return { ...defaultParams, ...urlParams };
  }

  React.useEffect(() => {
    appNavigate(searchParams, { replace: true });
    abortableDispatch(fetchSeasonsAnime, searchParams);

    if (!isSuccessSeasons) dispatch(fetchSeasonsList());
  }, []);

  React.useEffect(() => {
    const newParams = getSearchParams();
    if (!isEqual(searchParams, newParams)) {
      setSearchParams(newParams);
      abortableDispatch(fetchSeasonsAnime, newParams);
    }
  }, [abortableDispatch, location.search]);

  return (
    <div className="seasonal" ref={seasonalRef}>
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
          : getUniqueItems(items).map((item) => <AnimeCard item={item} key={item.mal_id} />)}
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
}

export default Seasonal;
