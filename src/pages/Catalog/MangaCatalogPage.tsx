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

  const abortableDispatch = useAbortableDispatch();
  const location = useLocation();

  const { items: genres, status: genresStatus } = useAppSelector((state) => state.mangaGenres);
  const { items, pagination, status } = useAppSelector((state) => state.mangaCatalog);
  const { isLoading, isError, isSuccess } = useFetchStatus(status);

  const [isShowFilters, setIsShowFilters] = React.useState(false);
  const isTablet = useMatchMedia('max', breakpoints.tablet);

  const parseSearchParams = React.useMemo(
    () =>
      parseMangaParams({
        allAllowed: false,
        rules: {
          page: true,
          status: true,
          min_score: true,
          max_score: true,
          type: { include: mangaTypeOptions.map((obj) => obj.value) },
          order_by: { include: ['mal_id', 'score', 'popularity', 'favorites'] },
          genres:
            genres.length > 0 ? { include: genres.map((obj) => obj.mal_id.toString()) } : true,
        },
      }),
    [genres],
  );

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

  // Скрываем фильтры поиска если ширина окна isTablet (чтоб не были сразу открытыми, если ширина обратно станет !isTablet)
  React.useEffect(() => {
    if (!isTablet && isShowFilters) setIsShowFilters(false);
  }, [isTablet]);

  // Получение даных об аниме за указанными параметрами
  React.useEffect(() => {
    if (genresStatus === FetchStatus.LOADING) return;

    abortableDispatch(fetchMangaByParams, searchParams);
  }, [searchParams, genres]);

  // Проверка значения параметра page при изменении pagination, чтоб он был в пределах (от 1 до последней видимой страницы в зависимости от запроса)
  React.useEffect(() => {
    if (!searchParams.page) return;

    const navigateOptions = { replace: true };
    if (searchParams.page <= 1) {
      appNavigate({ ...searchParams, page: undefined }, navigateOptions);
    } else if (pagination && pagination.last_visible_page < searchParams.page) {
      appNavigate({ ...searchParams, page: pagination.last_visible_page }, navigateOptions);
    }
  }, [pagination, appNavigate]);

  React.useEffect(() => {
    appNavigate(searchParams, { replace: true });
  }, [appNavigate]);

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
              onClick={() => setIsShowFilters(true)}>
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
                  const value = selected?.value;
                  appNavigate({
                    ...searchParams,
                    order_by: value,
                    sort: setSortForOrderBy(value),
                    page: undefined,
                  });
                }}
                menuPortalTarget={document.body}
                isSearchable={false}
                unstyled
              />
            </div>
          </div>
          <div className="catalog-cards__body">
            <CatalogSidebar
              className="catalog-cards__sidebar"
              selectedValues={searchParams}
              isModal={isTablet}
              isOpen={isShowFilters}
              onSubmit={(data) => {
                const { type, status, min_score, max_score, genres } = data;
                appNavigate({
                  ...searchParams,
                  type: type?.value,
                  status: status?.value,
                  min_score: min_score,
                  max_score: max_score,
                  genres: genres?.map((g) => g.value).join(','),
                  page: undefined,
                });

                setIsShowFilters(false);
              }}
              onReset={() => {
                appNavigate({ order_by: searchParams.order_by });
              }}
              onClose={() => setIsShowFilters(false)}
            />
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

//========================================================================================================================================================

type SelectValues = {
  type: SelectOption<MangaSearchType> | null;
  status: SelectOption<MangaSearchStatus> | null;
  genres: SelectOption<number>[];
};
type FormValues = SelectValues & {
  min_score: number | null;
  max_score: number | null;
};

interface CatalogSidebar {
  isModal?: boolean;
  isOpen?: boolean;
  selectedValues: MangaSearchParams; // Pick<AnimeSearchParams, 'type' | 'status' | 'rating' | 'min_score' | 'max_score' | 'genres'>;
  onSubmit?: (data: FormValues) => void;
  onReset?: () => void;
  onClose?: () => void;
  className?: string;
}

const CatalogSidebar: React.FC<CatalogSidebar> = ({
  isModal = false,
  isOpen = false,
  selectedValues,
  onSubmit,
  onReset,
  onClose,
  className,
}) => {
  const dispatch = useAppDispatch();
  const { items: genres, status: genresStatus } = useAppSelector((state) => state.mangaGenres);
  const { isLoading: isGenresLoading, isSuccess: isGenresSuccess } = useFetchStatus(genresStatus);

  const filterRef = React.useRef<HTMLFormElement>(null);

  const mangaGenresOptions = React.useMemo(() => {
    return genres.length > 0
      ? getUniqueItems(genres).map((obj) => ({
          value: obj.mal_id,
          label: obj.name,
        }))
      : [];
  }, [genres]);

  const { control, handleSubmit, reset, register } = useForm<FormValues>({
    defaultValues: getValuesForForm(),
  });

  // Получить данные с формы
  function getValuesForForm(): FormValues {
    const { type, status, min_score, max_score, genres } = selectedValues;
    return {
      type: (type && mangaTypeOptions.find((obj) => obj.value === type)) || null,
      status: (status && mangaStatusOptions.find((obj) => obj.value === status)) || null,
      min_score: min_score || null,
      max_score: max_score || null,
      genres:
        genres && mangaGenresOptions
          ? mangaGenresOptions.filter((obj) => genres.split(',').includes(obj.value.toString()))
          : [],
    };
  }

  React.useEffect(() => {
    // Получить жанры аниме, если их нет
    if (isGenresSuccess && genresStatus.length > 0) return;
    dispatch(fetchMangaGenres());
  }, []);

  // Получение даных об аниме по выбраным параметрам
  React.useEffect(() => {
    reset(getValuesForForm());
  }, [mangaGenresOptions, selectedValues]);

  // При сабмите формы
  const onSubmitForm = (data: FormValues) => {
    if (onSubmit) onSubmit(data);
  };

  // При сбросе данных формы
  const onResetForm = () => {
    reset();
    if (onReset) onReset();
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
            menuPortalTarget={isModal ? null : document.body}
            closeMenuOnSelect={!isMulti}
            isSearchable={false}
            isMulti={isMulti}
            isClearable
            unstyled
          />
        )}
      />
    );
  }

  return (
    <aside className={clsx(className, 'catalog-sidebar', { _show: isOpen, _modal: isModal })}>
      <div className="catalog-sidebar__inner">
        <div className="catalog-sidebar__header">
          <div className="catalog-sidebar__title">Filters</div>
          <button className="catalog-sidebar__close-btn" onClick={onClose}></button>
        </div>
        <form
          ref={filterRef}
          className="catalog-sidebar__filters"
          onSubmit={handleSubmit(onSubmitForm)}
          onReset={onResetForm}>
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
            {isGenresLoading ? (
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
};
