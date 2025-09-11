import React, { useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useFetchStatus, useMatchMedia } from '@/hooks';
import { searchParamsToString, getUniqueItems } from '@/utils';
import { MEDIA_QUERY } from '@/variables';
import {
  Genre,
  JikanPaginationPlus,
  MangaSearchOrder,
  MangaSearchParams,
  mangaSearchStatus,
  MangaSearchStatus,
  MangaStatus,
  MangaSearchType,
  mangaSearchType,
  SortOptions,
} from '@/models';
import { FetchStatus } from '@/typescript';
import { FilterIcon, MangaCard, Pagination } from '@/components';
import Select from 'react-select';
import Skeleton from 'react-loading-skeleton';
import clsx from 'clsx';
import './CatalogPage.scss';
import { fetchMangaGenres } from '@/store/genres/mangaGenresSlice';
import { fetchMangaByParams } from '@/store/manga/mangaCatalogSlice';

type OrderBy = Extract<MangaSearchOrder, 'mal_id' | 'score' | 'popularity' | 'favorites'>;
const allowedOrderBy: OrderBy[] = ['mal_id', 'score', 'popularity', 'favorites'];

function parseSearchParams(search: string): Partial<MangaSearchParams> {
  const params = new URLSearchParams(search);
  const result: Partial<MangaSearchParams> = {};

  for (const [key, value] of params.entries()) {
    switch (key) {
      case 'order_by':
        if (allowedOrderBy.includes(value as OrderBy)) {
          result.order_by = value as OrderBy;
        }
        break;
      case 'type':
        if (mangaSearchType.includes(value as MangaSearchType)) {
          result.type = value as MangaSearchType;
        }
        break;
      case 'status':
        if (mangaSearchStatus.includes(value as MangaSearchStatus)) {
          result.status = value as MangaSearchStatus;
        }
        break;
      case 'min_score':
      case 'max_score':
      case 'score':
        const score = Number(value);
        if (!isNaN(score) && score >= 1 && score < 10) {
          (result as any)[key] = score;
        }
        break;
      case 'genres':
      case 'genres_exclude':
        if (value) {
          result[key] = value
            .split(',')
            .filter((v) => /^\d+$/.test(v))
            .join(','); // в формате "1,2,3"
        }
        break;
      case 'page':
      case 'limit':
        const page = parseInt(value, 10);
        if (!isNaN(page)) {
          (result as any)[key] = page;
        }
        break;
      case 'sort':
      case 'magazines':
      case 'letter':
      case 'start_date':
      case 'end_date':
      case 'q':
        result[key as keyof MangaSearchParams] = value;
        break;
      case 'unapproved':
      case 'sfw':
        result[key as keyof MangaSearchParams] = value === 'true';
        break;
      default:
        break;
    }
  }

  const availableParams: Array<keyof MangaSearchParams> = [
    'type',
    'status',
    'min_score',
    'max_score',
    'genres',
    'order_by',
    'page',
  ];

  for (const key in result) {
    if (!availableParams.includes(key)) delete result[key];
  }
  if (result.min_score && result.max_score && result.min_score > result.max_score)
    delete result.max_score;

  return result;
}

type SelectOption<T, L = string> = {
  value: T;
  label: L;
};

const mangaTypeOptions = mangaSearchType.map((type) => ({
  value: type,
  label: type,
}));
const mangaStatusOptions: Array<SelectOption<MangaSearchStatus, MangaStatus>> = [
  { value: 'complete', label: 'Finished' },
  { value: 'publishing', label: 'Publishing' },
  { value: 'hiatus', label: 'On Hiatus' },
  { value: 'upcoming', label: 'Not yet published' },
  { value: 'discontinued', label: 'Discontinued' },
];
const mangaOrderByOptions: Array<SelectOption<MangaSearchOrder>> = [
  { value: 'score', label: 'Score' },
  { value: 'popularity', label: 'Popularity' },
  { value: 'favorites', label: 'Favorites' },
  { value: 'mal_id', label: 'ID' },
];

type SelectValues = {
  type: SelectOption<MangaSearchType> | null;
  status: SelectOption<MangaSearchStatus> | null;
  genres: SelectOption<number>[];
};
type FormValues = SelectValues & {
  min_score: number | null;
  max_score: number | null;
};

type ExtractOptionValue<T> = T extends SelectOption<infer U>
  ? U
  : T extends SelectOption<infer U>[]
  ? U
  : never;

const setSortForOrderBy = (
  param: keyof MangaSearchParams | undefined | null,
): SortOptions | undefined => {
  if (!param) return undefined;

  const sort: Record<keyof MangaSearchParams, SortOptions> = {
    score: 'desc',
    popularity: 'asc',
    favorites: 'desc',
    mal_id: 'asc',
  };
  return sort[param];
};

const MangaCatalogPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [searchParams, setSearchParams] = React.useState<MangaSearchParams>({
    order_by: 'score',
    ...parseSearchParams(location.search),
  });

  const { items: genres, status: genresStatus } = useAppSelector((state) => state.mangaGenres);
  const { items, pagination, status } = useAppSelector((state) => state.mangaCatalog);
  const { isLoading } = useFetchStatus(status);

  const isTablet = useMatchMedia('max', MEDIA_QUERY.tablet);
  const [isShowFilters, setIsShowFilters] = React.useState(false);
  const openFilters = () => setIsShowFilters(true);
  const closeFilters = () => setIsShowFilters(false);

  const mangaGenresOptions = React.useMemo(() => {
    return genres.length > 0
      ? getUniqueItems(genres).map((obj: Genre) => ({
          value: obj.mal_id,
          label: obj.name,
        }))
      : [];
  }, [genres]);

  const { control, handleSubmit, reset, register } = useForm<FormValues>({
    defaultValues: getFormDefaulValues(),
  });

  const cardsRef = React.useRef<HTMLDivElement>(null);

  // Получить жанры аниме, если их нет
  React.useEffect(() => {
    if (genresStatus === FetchStatus.SUCCESS) return;
    dispatch(fetchMangaGenres());
  }, []);

  // Обновить данные в форме после получения жанров и формирования mangaGenresOptions
  React.useEffect(() => {
    if (mangaGenresOptions.length > 0) reset(getFormDefaulValues());
  }, [mangaGenresOptions]);

  // Обновить url если изменились параметры поиска в searchParams
  const isFirstRender = useRef(true);
  React.useEffect(() => {
    navigate(
      {
        search: searchParamsToString(searchParams),
      },
      { replace: isFirstRender.current },
    );

    if (isFirstRender) isFirstRender.current = false;
  }, [searchParams]);

  // Получение даных об аниме за указанными параметрами
  const fetchMangaController = useRef<AbortController | null>(null);
  React.useEffect(() => {
    if (genresStatus === FetchStatus.LOADING) return;

    fetchMangaController.current?.abort();

    fetchMangaController.current = new AbortController();
    dispatch(
      fetchMangaByParams(
        {
          ...searchParams,
          sort: setSortForOrderBy(searchParams.order_by),
        },
        { signal: fetchMangaController.current.signal },
      ),
    );

    return () => {
      fetchMangaController.current?.abort();
    };
  }, [location.search, genres]);

  // Проверка значения параметра page при изменении pagination, чтоб он был в пределах (1 - последняя видимая страница в зависимости от запроса)
  React.useEffect(() => {
    if (searchParams.page && searchParams.page < 1) {
      setSearchParams((prev) => ({
        ...prev,
        page: undefined,
      }));
    } else if (
      pagination &&
      searchParams.page &&
      pagination.last_visible_page < searchParams.page
    ) {
      setSearchParams((prev) => ({
        ...prev,
        page: pagination.last_visible_page,
      }));
    }
  }, [pagination]);

  React.useEffect(() => {
    if (!isTablet && isShowFilters) {
      setIsShowFilters(false);
    }
  }, [isTablet]);

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
  const onSubmit = handleSubmit((data: FormValues) => {
    setSearchParams((prev) =>
      parseSearchParams(
        searchParamsToString({
          ...prev,
          type: data.type?.value,
          status: data.status?.value,
          min_score: data.min_score,
          max_score: data.max_score,
          genres: data.genres?.map((g: any) => g.value).join(','),
          page: undefined,
        }),
      ),
    );
  });

  // Держать значение для minScore и maxScore в пределах нормы 1-9.99
  const onScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const min = Number(e.target.min);
    const max = Number(e.target.max);
    const value = Number(e.target.value);

    if (value < min) e.target.value = min.toString();
    else if (value > max) e.target.value = max.toString();
    else e.target.value = value.toFixed(2).replace(/\.?0+$/, '');
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
        <form onSubmit={onSubmit} className="catalog-sidebar__filters">
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
                      setValueAs: (value) => {
                        console.log(value);

                        if (value === '') return null;
                        const min = 1;
                        const max = 9.99;

                        if (value < min) return min;
                        else if (value > max) return max;
                        else
                          return Number(value)
                            .toFixed(2)
                            .replace(/\.?0+$/, '');
                      },
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

          <button className="catalog-sidebar__filters-btn btn btn--outline">Search</button>
        </form>
      </div>
    </aside>
  );

  return (
    <div className="catalog">
      <CatalogIntro title="Manga Catalog" pagination={pagination} />

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
                placeholder=""
                defaultValue={mangaOrderByOptions[0]}
                value={mangaOrderByOptions.find(
                  (obj) => obj.value === parseSearchParams(location.search).order_by,
                )}
                options={mangaOrderByOptions}
                onChange={(selected) => {
                  setSearchParams((prev) => ({
                    ...prev,
                    order_by: selected?.value,
                    page: undefined,
                  }));
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
                {isLoading
                  ? Array.from({ length: 24 }).map((_, i) => (
                      <Skeleton
                        key={i}
                        containerClassName="catalog-cards__card _skeleton-container border-opacity"
                        className=" _skeleton "
                      />
                    ))
                  : getUniqueItems(items).map((item) => (
                      <MangaCard key={item.mal_id} item={item} className="catalog-cards__card" />
                    ))}
              </div>
              {pagination && (
                <Pagination
                  currentPage={pagination.current_page}
                  totalItems={pagination.items.total}
                  itemsPerPage={pagination.items.per_page}
                  className="catalog-cards__pagination"
                  onChangePage={(page) => {
                    console.log('onChangePage');

                    setSearchParams((prev) => ({ ...prev, page: page > 1 ? page : undefined }));

                    if (!cardsRef.current) return;

                    const tabsTop = cardsRef.current.getBoundingClientRect().top;
                    if (tabsTop >= 0) return;

                    window.scrollTo({
                      top: tabsTop + window.scrollY - 10,
                      behavior: 'smooth',
                    });
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

/*==========================
/*====== CatalogIntro ======
/*=========================*/
type CatalogIntroProps = { pagination: JikanPaginationPlus | null; title: string };

const CatalogIntro: React.FC<CatalogIntroProps> = ({ pagination, title }) => {
  return (
    <section className="catalog__intro catalog-intro catalog-intro--manga">
      <div className="container">
        <div className="catalog-intro__inner">
          <h2 className="catalog-intro__title title">{title}</h2>
          <div className="catalog-intro__result">
            Search manga results: <span>{(pagination && pagination.items.total) || '*****'}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
