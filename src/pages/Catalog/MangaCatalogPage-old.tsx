import React, { useRef } from 'react';
import Select from 'react-select';
import Skeleton from 'react-loading-skeleton';
import { useForm, Controller } from 'react-hook-form';
import { useLocation } from 'react-router-dom';

import { fetchMangaGenres } from '@/store/genres/mangaGenresSlice';
import { fetchMangaByParams } from '@/store/catalog/mangaCatalogSlice';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useAbortableDispatch, useAppNavigate, useFetchStatus, useMatchMedia } from '@/hooks';
import { AllowedParams, getUniqueItems, isEmpty, parseMangaParams, scrollToTop } from '@/utils';
import { mangaOrderByOptions, mangaStatusOptions, mangaTypeOptions } from '@/resources';
import { CommonIntro, EmptyValueMessage, FilterIcon, MangaCard, Pagination } from '@/components';

import {
  MangaSearchOrder,
  MangaSearchParams,
  MangaSearchStatus,
  MangaSearchType,
  SortOptions,
} from '@/models';
import { ExtractOptionValue, FetchStatus, SelectOption } from '@/typescript';

import clsx from 'clsx';
import './CatalogPage.scss';
import { breakpoints } from '@/constants';

type SelectValues = {
  type: SelectOption<MangaSearchType> | null;
  status: SelectOption<MangaSearchStatus> | null;
  genres: SelectOption<number>[];
};
type FormValues = SelectValues & {
  min_score: number | null;
  max_score: number | null;
};

const setSortForOrderBy = (param: MangaSearchOrder | undefined): SortOptions | undefined => {
  const sort: Partial<Record<MangaSearchOrder, SortOptions>> = {
    score: 'desc',
    popularity: 'asc',
    favorites: 'desc',
    mal_id: 'asc',
  };
  return param ? sort[param] : undefined;
};


const allowedMangaParams: AllowedParams<MangaSearchParams> = {
  allAllowed: false,
  rules: {
    type: true,
    status: true,
    min_score: true,
    max_score: true,
    genres: true,
    order_by: { include: ['mal_id', 'score', 'popularity', 'favorites'] },
    page: true,
  },
} as const;

type AllowedMangaParams = keyof NonNullable<typeof allowedMangaParams.rules>;

const defaultSearchParams: Pick<MangaSearchParams, AllowedMangaParams> = {
  order_by: 'score',
};

const parseSearchParams = parseMangaParams(allowedMangaParams);

//========================================================================================================================================================
const MangaCatalogPage: React.FC = () => {
  const cardsRef = React.useRef<HTMLDivElement>(null);
  const filterRef = React.useRef<HTMLFormElement>(null);
  const isFirstRender = useRef(true);

  const dispatch = useAppDispatch();
  const abortableDispatch = useAbortableDispatch();
  const location = useLocation();
  const appNavigate = useAppNavigate(parseSearchParams, defaultSearchParams);

  const searchParams = React.useMemo<MangaSearchParams>(() => {
    const urlParams = parseSearchParams(location.search);
    return {
      ...defaultSearchParams,
      ...urlParams,
      sort: setSortForOrderBy(
        urlParams.order_by ? urlParams.order_by : defaultSearchParams.order_by,
      ),
    };
  }, [location.search]);

  const { items: genres, status: genresStatus } = useAppSelector((state) => state.mangaGenres);
  const { items, pagination, status } = useAppSelector((state) => state.mangaCatalog);
  const { isLoading, isError, isSuccess } = useFetchStatus(status);

  const isTablet = useMatchMedia('max', breakpoints.tablet);
  const [isShowFilters, setIsShowFilters] = React.useState(false);
  const openFilters = () => setIsShowFilters(true);
  const closeFilters = () => setIsShowFilters(false);

  const mangaGenresOptions = React.useMemo(() => {
    return genres.length > 0
      ? getUniqueItems(genres).map((obj) => ({
          value: obj.mal_id,
          label: obj.name,
        }))
      : [];
  }, [genres]);

  const { control, handleSubmit, reset, register } = useForm<FormValues>({
    defaultValues: getFormDefaulValues(),
  });

  // Обновить данные в форме после получения жанров и формирования animeGenresOptions или после смены search параметров
  React.useEffect(() => {
    if (mangaGenresOptions.length > 0) reset(getFormDefaulValues());
  }, [mangaGenresOptions, searchParams]);

  // Получение даных об аниме за указанными параметрами
  React.useEffect(() => {
    reset(getFormDefaulValues());
    if (genresStatus === FetchStatus.LOADING) return;

    abortableDispatch(fetchMangaByParams, searchParams);
  }, [searchParams, genres]);

  // Проверка значения параметра page при изменении pagination, чтоб он был в пределах (от 1 до последней видимой страницы в зависимости от запроса)
  React.useEffect(() => {
    if (searchParams.page && searchParams.page < 1) {
      appNavigate({ ...searchParams, page: undefined }, { replace: isFirstRender.current });
    } else if (
      pagination &&
      searchParams.page &&
      pagination.last_visible_page < searchParams.page
    ) {
      appNavigate(
        { ...searchParams, page: pagination.last_visible_page },
        { replace: isFirstRender.current },
      );
    }
  }, [pagination]);

  // Скрываем фильтры поиска если ширина окна isTablet (чтоб не были сразу открытыми, если ширина обратно станет !isTablet)
  React.useEffect(() => {
    if (!isTablet && isShowFilters) setIsShowFilters(false);
  }, [isTablet]);

  React.useEffect(() => {
    appNavigate(searchParams, { replace: isFirstRender.current });
    isFirstRender.current = false;

    // Получить жанры аниме, если их нет
    if (genresStatus === FetchStatus.SUCCESS && genresStatus.length > 0) return;
    dispatch(fetchMangaGenres());
  }, []);

  // Получить данные с формы
  function getFormDefaulValues() {
    return {
      type: searchParams.type
        ? mangaTypeOptions.find((obj) => obj.value === searchParams.type)
        : null,
      status: searchParams.status
        ? mangaStatusOptions.find((obj) => obj.value === searchParams.status)
        : null,
      min_score: searchParams.min_score && +searchParams.min_score ? +searchParams.min_score : null,
      max_score: searchParams.max_score && +searchParams.max_score ? +searchParams.max_score : null,
      genres:
        searchParams.genres && mangaGenresOptions
          ? mangaGenresOptions.filter(
              (obj) =>
                searchParams.genres &&
                searchParams.genres.split(',').includes(obj.value.toString()),
            )
          : [],
    };
  }

  // При сабмите формы собрать с неё данные и сохранить в searchParams
  const onSubmit = (data: FormValues) => {
    appNavigate({
      ...searchParams,
      type: data.type?.value,
      status: data.status?.value,
      min_score: data.min_score,
      max_score: data.max_score,
      genres: data.genres?.map((g) => g.value).join(','),
      page: undefined,
    });
  };

  // Держать значение для minScore и maxScore в пределах нормы 1-9.99
  const onScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isEmpty(e.target.value)) return;

    const min = e.target.min;
    const max = e.target.max;
    const value = e.target.value;

    if (+value < +min) {
      e.target.value = min;
    } else if (+value > +max) {
      e.target.value = max;
    } else if (!/^\d*\.?\d{0,2}$/.test(value)) {
      e.target.value = value.match(/^\d*\.?\d{0,2}/)?.[0] ?? '';
    }
  };

  // Рендер кастомного выпадающего списка
  function renderSelect<Name extends keyof SelectValues>(
    name: Name,
    options: SelectOption<ExtractOptionValue<SelectValues[Name]>>[],
    placeholder: string,
    isMulti: SelectValues[Name] extends SelectOption<any>[] ? true : false = false as any,
  ) {
    return (
      <Controller
        name={name as any}
        control={control}
        render={({ field }) => (
          <Select<SelectOption<ExtractOptionValue<SelectValues[Name]>>, typeof isMulti>
            {...field}
            className="filters-item__select select"
            classNamePrefix="filters-item__select select"
            options={options}
            value={field.value}
            onChange={field.onChange}
            placeholder={placeholder}
            menuPortalTarget={isTablet ? null : document.body}
            isSearchable={false}
            closeMenuOnSelect={!isMulti}
            isMulti={isMulti}
            isClearable
            unstyled
          />
        )}
      />
    );
  }

  // Рендер сайдбара (фильтров)
  const renderCatalogSidebar = () => (
    <aside className={clsx('catalog-cards__sidebar catalog-sidebar', { _show: isShowFilters })}>
      <div className="catalog-sidebar__inner">
        <div className="catalog-sidebar__header">
          <div className="catalog-sidebar__title">Filters</div>
          <button className="catalog-sidebar__close-btn" onClick={closeFilters}></button>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          onReset={() => {
            reset(getFormDefaulValues());
            appNavigate({ order_by: searchParams.order_by });
          }}
          className="catalog-sidebar__filters"
          ref={filterRef}>
          <div className="catalog-sidebar__filters-item filters-item">
            <div className="filters-item__title">Type</div>
            {renderSelect('type', mangaTypeOptions, 'Select manga type...')}
          </div>
          <div className="catalog-sidebar__filters-item filters-item">
            <div className="filters-item__title">Status</div>
            {renderSelect('status', mangaStatusOptions, 'Select manga status...')}
          </div>
          <div className="catalog-sidebar__filters-item filters-item">
            <div className="filters-item__title">Genre</div>
            {genresStatus === FetchStatus.LOADING ? (
              <Skeleton className="select__control " containerClassName="select" />
            ) : (
              renderSelect('genres', mangaGenresOptions, 'Genres for one manga ...', true)
            )}
          </div>
          <div className="catalog-sidebar__filters-item filters-item">
            <div className="filters-item__title">
              Score <span>( 1 - 9.99 )</span>
            </div>
            <div className="filters-item__row">
              <div className="filters-item__score">
                <div className="filters-item__input filters-item__input--min">
                  <input
                    type="number"
                    step="0.01"
                    min={1}
                    max={9.99}
                    {...register('min_score', {
                      min: 1,
                      max: 9.99,
                      setValueAs: (v) => (v === '' ? null : parseFloat(v)),
                      onChange: onScoreChange,
                    })}
                  />
                </div>
              </div>
              <div className="filters-item__score">
                <div className="filters-item__input filters-item__input--max">
                  <input
                    type="number"
                    step="0.01"
                    min={1}
                    max={9.99}
                    {...register('max_score', {
                      min: 1,
                      max: 9.99,
                      setValueAs: (v) => (v === '' ? null : parseFloat(v)),
                      onChange: onScoreChange,
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
          <button className="catalog-sidebar__filters-btn btn btn--white" type="submit">
            Search
          </button>
          <button className="catalog-sidebar__filters-btn btn btn--outline" type="reset">
            Clear
          </button>
        </form>
      </div>
    </aside>
  );

  return (
    <div className="catalog">
      <CommonIntro
        bgPrefix="manga"
        title="Manga Catalog"
        subtitle={
          <>
            Search manga results: <span>{(pagination && pagination.items.total) || '*****'}</span>
          </>
        }
      />

      <div className="catalog__cards catalog-cards" ref={cardsRef}>
        <div className="container">
          <div className="catalog-cards__top">
            <button
              className="catalog-cards__show-filters btn btn--icon btn--fill"
              onClick={openFilters}>
              <FilterIcon />
              Filters
            </button>
            <div className="catalog-cards__sorting catalog-sorting">
              <span>Sort By:</span>
              <Select
                className="catalog-sorting__select select"
                classNamePrefix="select"
                defaultValue={mangaOrderByOptions[0]}
                value={mangaOrderByOptions.find((obj) => obj.value === searchParams.order_by)}
                options={mangaOrderByOptions}
                onChange={(selected) => {
                  appNavigate({ ...searchParams, order_by: selected?.value, page: undefined });
                }}
                menuPortalTarget={document.body}
                isSearchable={false}
                unstyled
              />
            </div>
          </div>
          <div className="catalog-cards__body">
            {renderCatalogSidebar()}
            <div className="catalog-cards__content">
              <div className="catalog-cards__items">
                {isLoading &&
                  Array.from({ length: 24 }).map((_, i) => (
                    <Skeleton
                      key={i}
                      containerClassName="catalog-cards__card _skeleton-container border-opacity"
                      className=" _skeleton "
                    />
                  ))}
                {isSuccess &&
                  items.length > 0 &&
                  getUniqueItems(items).map((item) => (
                    <MangaCard key={item.mal_id} item={item} className="catalog-cards__card" />
                  ))}
              </div>
              {isSuccess && items.length === 0 && (
                <EmptyValueMessage
                  message="No search results found."
                  className="catalog-cards__message"
                />
              )}
              {isError && (
                <EmptyValueMessage
                  message="Something went wrong!"
                  className="catalog-cards__message"
                />
              )}
              {pagination && (
                <Pagination
                  currentPage={pagination.current_page}
                  totalItems={pagination.items.total}
                  itemsPerPage={pagination.items.per_page}
                  className="catalog-cards__pagination"
                  onChangePage={(page) => {
                    appNavigate({ ...searchParams, page: page > 1 ? page : undefined });
                    scrollToTop(cardsRef);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MangaCatalogPage;
