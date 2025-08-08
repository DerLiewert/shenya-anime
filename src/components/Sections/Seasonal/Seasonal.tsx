import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { AnimeCard, Loading } from '@/components';
import { useAbortableDispatch, useAppNavigate, useFetchStatus } from '@/hooks';
import {
  AnimeSeason,
  animeSeasons,
  JikanSeasonsPlusParams,
  seasonAnimeType,
  SeasonAnimeType,
} from '@/models';
import { fetchSeasonsList } from '@/store/season/seasonListSlice';
import { fetchSeasonsAnime } from '@/store/season/seasonsAnimeSlice';
import { getSeasonName, uniqueItems } from '@/utils';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { useLocation } from 'react-router-dom';
import Select from 'react-select';
import './Seasonal.scss';

export function parseSearchParams(search: string): Partial<JikanSeasonsPlusParams> {
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

const seasonOptions = animeSeasons.map((str) => ({ value: str, label: str }));

const getDefaultParams = () => ({ year: new Date().getFullYear(), season: getSeasonName() });

function Seasonal() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const appNavigate = useAppNavigate(parseSearchParams);
  const seasonsList = useAppSelector((state) => state.seasonsList.items);
  const { isLoading: isLoadingSeasons } = useFetchStatus((state) => state.seasonsList.status);
  const {
    items,
    pagination,
    season: prevSeason,
    status,
  } = useAppSelector((state) => state.seasonsAnime);
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

  const param = React.useMemo(
    () => ({ ...searchParams, page: 1 }),
    [searchParams.year, searchParams.season],
  );

  useAbortableDispatch(
    fetchSeasonsAnime,
    param,
    isLoadingItems ||
      prevSeason?.year !== searchParams.year ||
      prevSeason?.season !== searchParams.season,
  );

  React.useEffect(() => {
    dispatch(fetchSeasonsList());
    appNavigate({ ...searchParams }, {replace: true})
  }, []);

  React.useEffect(() => {
    dispatch(fetchSeasonsAnime(searchParams));
  }, [searchParams]);

  const onShowMore = () => {
    if (pagination && pagination.has_next_page) {
      dispatch(
        fetchSeasonsAnime({
          ...searchParams,
          page: pagination.current_page + 1,
        }),
      );
    }
  };

  return (
    <div className="seasonal">
      <div className="seasonal__filter">
        {yearOptions.length > 0 && isLoadingSeasons ? (
          <Skeleton className="select__control " containerClassName="select seasonal__select" />
        ) : (
          <Select
            className="seasonal__select select"
            classNamePrefix="select"
            placeholder=""
            defaultValue={yearOptions[0]}
            value={
              yearOptions.find((obj) => obj.value === parseSearchParams(location.search).year) ?? {
                value: searchParams.year,
                label: searchParams.year,
              }
            }
            options={yearOptions}
            onChange={(selected) => {
              if (selected) appNavigate({ ...searchParams, year: selected.value });
            }}
            menuPortalTarget={document.body}
            isSearchable={false}
            unstyled
          />
        )}
        {seasonOptions && seasonOptions.length > 0 && (
          <Select
            className="seasonal__select select"
            classNamePrefix="select"
            placeholder=""
            defaultValue={seasonOptions[0]}
            value={
              seasonOptions.find(
                (obj) => obj.value === parseSearchParams(location.search).season,
              ) ?? { value: searchParams.season, label: searchParams.season }
            }
            options={seasonOptions}
            onChange={(selected) => {
              if (selected) appNavigate({ ...searchParams, season: selected.value });
            }}
            menuPortalTarget={document.body}
            isSearchable={false}
            unstyled
          />
        )}
      </div>
      <div className="seasonal__items ">
        {uniqueItems(items).map((item) => (
          <AnimeCard item={item} key={item.mal_id} />
        ))}
      </div>
      {isLoadingItems && <Loading className="seasonal__loader" />}
      {items.length > 0 && pagination?.has_next_page && (
        <div className="seasonal__show-more-wrapper bnts-wrapper">
          <button
            className="seasonal__show-more show-more-btn btn btn--upper btn--outline"
            onClick={onShowMore}
            disabled={isLoadingItems}>
            Show more
          </button>
        </div>
      )}
    </div>
  );
}

export default Seasonal;

/*==========================
/*====== CatalogIntro ======
/*=========================*/
const SeasonalIntro: React.FC<{ title: string }> = ({ title }) => {
  return (
    <section className="catalog__intro catalog-intro ">
      <div className="container">
        <div className="catalog-intro__inner">
          <h2 className="catalog-intro__title title">{title}</h2>
        </div>
      </div>
    </section>
  );
};
