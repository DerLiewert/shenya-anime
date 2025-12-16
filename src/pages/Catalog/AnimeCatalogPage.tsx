import React from 'react';
import Select from 'react-select';
import Skeleton from 'react-loading-skeleton';
import { useLocation } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useAbortableDispatch, useAppNavigate, useFetchStatus, useMatchMedia } from '@/hooks';
import { breakpoints } from '@/constants';
import { scrollToTop, getUniqueItems, parseAnimeSearchParams, onScoreChange } from '@/utils';
import {
  animeOrderByOptions,
  animeRatingOptions,
  animeStatusOptions,
  animeTypeOptions,
} from '@/resources';
import {
  AnimeSearchOrder,
  AnimeSearchParams,
  AnimeSearchRating,
  AnimeSearchStatus,
  AnimeSearchType,
  SortOptions,
  ExtractOptionValue,
  SelectOption,
} from '@/typescript';
import { AnimeCard, CommonIntro, EmptyValueMessage, FilterIcon, Pagination } from '@/components';
import { fetchAnimeByParams, fetchAnimeGenres, minusOpenModal, plusOpenModal } from '@/store';
import clsx from 'clsx';
import './CatalogPage.scss';

const setSortForOrderBy = (param: AnimeSearchOrder | undefined): SortOptions | undefined => {
  const sort: Partial<Record<AnimeSearchOrder, SortOptions>> = {
    score: 'desc',
    popularity: 'asc',
    favorites: 'desc',
    mal_id: 'asc',
  };
  return param ? sort[param] : undefined;
};

//========================================================================================================================================================
const AnimeCatalogPage: React.FC = () => {
  const cardsRef = React.useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const abortableDispatch = useAbortableDispatch();
  const location = useLocation();

  const { items: genres, status: genresStatus } = useAppSelector((state) => state.animeGenres);
  const { isLoading: isGenresLoading } = useFetchStatus(genresStatus);

  const { items, pagination, status } = useAppSelector((state) => state.animeCatalog);
  const { isLoading, isSuccess, isError } = useFetchStatus(status);

  const [isShowFilters, setIsShowFilters] = React.useState(false);
  const isTablet = useMatchMedia('max', breakpoints.tablet);

  const parseSearchParams = React.useMemo(
    () =>
      parseAnimeSearchParams({
        allAllowed: false,
        rules: {
          status: true,
          rating: true,
          min_score: true,
          max_score: true,
          type: { include: animeTypeOptions.map((obj) => obj.value) },
          order_by: { include: ['mal_id', 'score', 'popularity', 'favorites'] },
          genres:
            genres.length > 0 ? { include: genres.map((obj) => obj.mal_id.toString()) } : true,
          page: pagination?.last_visible_page
            ? { include: { from: 1, to: pagination.last_visible_page } }
            : true,
        },
      }),
    [genres, pagination?.last_visible_page],
  );

  const appNavigate = useAppNavigate(parseSearchParams);

  const searchParams = React.useMemo<AnimeSearchParams>(() => {
    const defaultParams: AnimeSearchParams = { order_by: 'score' };
    const urlParams = parseSearchParams(location.search);
    return {
      ...defaultParams,
      ...urlParams,
      sort: setSortForOrderBy(urlParams.order_by || defaultParams.order_by),
    };
  }, [location.search]);

  const openFilters = () => {
    dispatch(plusOpenModal());
    setIsShowFilters(true);
  };

  const closeFilters = () => {
    dispatch(minusOpenModal());
    setIsShowFilters(false);
  };

  React.useEffect(() => {
    if (!isTablet && isShowFilters) closeFilters();
  }, [isTablet]);

  // Получение даных об аниме по выбраным параметрам
  React.useEffect(() => {
    if (isGenresLoading) return;
    abortableDispatch(fetchAnimeByParams, searchParams);
  }, [searchParams, genresStatus]); // maybe genres

  React.useEffect(() => {
    appNavigate(searchParams, { replace: true });
  }, [appNavigate]);

  return (
    <div className="catalog">
      <CommonIntro
        bgPrefix="anime"
        title="Anime Catalog"
        subtitle={
          <>
            Search anime results:{' '}
            <span>
              {pagination ? (pagination.items.total ? pagination.items.total : 0) : '*****'}
            </span>
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
                defaultValue={animeOrderByOptions[0]}
                value={animeOrderByOptions.find((obj) => obj.value === searchParams.order_by)}
                options={animeOrderByOptions}
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
                const { type, status, rating, min_score, max_score, genres } = data;
                appNavigate({
                  ...searchParams,
                  type: type?.value,
                  status: status?.value,
                  rating: rating?.value,
                  min_score: min_score,
                  max_score: max_score,
                  genres: genres?.map((g) => g.value).join(','),
                  page: undefined,
                });

                closeFilters();
              }}
              onReset={() => {
                appNavigate({ order_by: searchParams.order_by });
              }}
              onClose={closeFilters}
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
                    <AnimeCard key={item.mal_id} item={item} className="catalog-cards__card" />
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

export default AnimeCatalogPage;

//========================================================================================================================================================

type SelectValues = {
  type: SelectOption<AnimeSearchType> | null;
  status: SelectOption<AnimeSearchStatus> | null;
  rating: SelectOption<AnimeSearchRating> | null;
  genres: SelectOption<number>[];
};

type FormValues = SelectValues & {
  min_score: number | null;
  max_score: number | null;
};

interface CatalogSidebar {
  isModal?: boolean;
  isOpen?: boolean;
  selectedValues: AnimeSearchParams; // Pick<AnimeSearchParams, 'type' | 'status' | 'rating' | 'min_score' | 'max_score' | 'genres'>;
  className?: string;
  onSubmit?: (data: FormValues) => void;
  onReset?: () => void;
  onClose?: () => void;
}

const CatalogSidebar: React.FC<CatalogSidebar> = ({
  isModal = false,
  isOpen = false,
  selectedValues,
  className,
  onSubmit,
  onReset,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const { items: genres, status: genresStatus } = useAppSelector((state) => state.animeGenres);
  const { isLoading: isGenresLoading, isSuccess: isGenresSuccess } = useFetchStatus(genresStatus);

  const filterRef = React.useRef<HTMLFormElement>(null);
  const sidebarRef = React.useRef<HTMLDivElement>(null);

  const animeGenresOptions = React.useMemo(() => {
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
    const { type, status, rating, min_score, max_score, genres } = selectedValues;
    return {
      type: (type && animeTypeOptions.find((obj) => obj.value === type)) || null,
      status: (status && animeStatusOptions.find((obj) => obj.value === status)) || null,
      rating: (rating && animeRatingOptions.find((obj) => obj.value === rating)) || null,
      min_score: min_score || null,
      max_score: max_score || null,
      genres:
        genres && animeGenresOptions
          ? animeGenresOptions.filter((obj) => genres.split(',').includes(obj.value.toString()))
          : [],
    };
  }

  // Закрытие модального окна
  React.useEffect(() => {
    if (!onClose) return;

    const closeModal = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target === sidebarRef.current) onClose();
    };

    document.addEventListener('click', closeModal);
    return () => {
      document.removeEventListener('click', closeModal);
    };
  }, []);

  React.useEffect(() => {
    // Получить жанры аниме, если их нет
    if (isGenresSuccess && genresStatus.length > 0) return;
    dispatch(fetchAnimeGenres());
  }, []);

  // Получение даных об аниме по выбраным параметрам
  React.useEffect(() => {
    reset(getValuesForForm());
  }, [animeGenresOptions, selectedValues]);

  // При сабмите формы
  const onSubmitForm = (data: FormValues) => {
    if (onSubmit) onSubmit(data);
  };

  // При сбросе данных формы
  const onResetForm = () => {
    reset();
    if (onReset) onReset();
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
    <aside
      ref={sidebarRef}
      className={clsx(className, 'catalog-sidebar', { _show: isOpen, _modal: isModal })}>
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
            {renderSelect('type', animeTypeOptions, 'Select anime type...')}
          </div>
          <div className="catalog-sidebar__filters-item filters-item">
            <div className="filters-item__title">Status</div>
            {renderSelect('status', animeStatusOptions, 'Select anime status...')}
          </div>
          <div className="catalog-sidebar__filters-item filters-item">
            <div className="filters-item__title">Rating</div>
            {renderSelect('rating', animeRatingOptions, 'Select anime rating...')}
          </div>
          <div className="catalog-sidebar__filters-item filters-item">
            <div className="filters-item__title">Genre</div>
            {isGenresLoading ? (
              <Skeleton className="select__control" containerClassName="select" />
            ) : (
              renderSelect('genres', animeGenresOptions, 'Genres for one anime ...', true)
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
