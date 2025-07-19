import React, { useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useAppNavigate, useFetchStatus, useMatchMedia } from '@/hooks';
import { searchParamsToString, uniqueItems } from '@/utils';
import { MEDIA_QUERY } from '@/variables';
import {
  Anime,
  AnimeRating,
  AnimeSearchOrder,
  AnimeSearchParams,
  animeSearchRating,
  AnimeSearchRating,
  animeSearchStatus,
  AnimeSearchStatus,
  AnimeStatus,
  AnimeType,
  animeTypes,
  Genre,
  JikanPaginationPlus,
  Manga,
  SortOptions,
} from '@/models';
import { FetchStatus } from '@/types';
import { fetchAnimeByParams } from '@/store/anime/animeCatalogSlice';
import { fetchAnimeGenres } from '@/store/anime/animeGenresSlice';
import { AnimeCard, FilterIcon, Pagination } from '@/components';
import Select from 'react-select';
import Skeleton from 'react-loading-skeleton';
import clsx from 'clsx';
import './CatalogPage.scss';
import CatalogPage from './CatalogPage';

type OrderBy = Extract<AnimeSearchOrder, 'mal_id' | 'score' | 'popularity' | 'favorites'>;
const allowedOrderBy: OrderBy[] = ['mal_id', 'score', 'popularity', 'favorites'];

export function parseSearchParams(search: string): Partial<AnimeSearchParams> {
  const params = new URLSearchParams(search);
  const result: Partial<AnimeSearchParams> = {};

  for (const [key, value] of params.entries()) {
    switch (key) {
      case 'order_by':
        if (allowedOrderBy.includes(value as OrderBy)) {
          result.order_by = value as OrderBy;
        }
        break;
      case 'type':
        if (animeTypes.includes(value as AnimeType)) {
          result.type = value as AnimeType;
        }
        break;
      case 'status':
        if (animeSearchStatus.includes(value as AnimeSearchStatus)) {
          result.status = value as AnimeSearchStatus;
        }
        break;
      case 'rating':
        if (animeSearchRating.includes(value as AnimeSearchRating)) {
          result.rating = value as AnimeSearchRating;
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
      case 'producers':
      case 'letter':
      case 'start_date':
      case 'end_date':
      case 'q':
        result[key as keyof AnimeSearchParams] = value;
        break;
      case 'unapproved':
      case 'sfw':
        result[key as keyof AnimeSearchParams] = value === 'true';
        break;
      default:
        break;
    }
  }

  const availableParams: Array<keyof AnimeSearchParams> = [
    'type',
    'status',
    'min_score',
    'max_score',
    'rating',
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

const animeTypeOptions = animeTypes.map((type) => ({
  value: type,
  label: type,
}));
const animeStatusOptions: Array<SelectOption<AnimeSearchStatus, AnimeStatus>> = [
  { value: 'airing', label: 'Currently Airing' },
  { value: 'complete', label: 'Finished Airing' },
  { value: 'upcoming', label: 'Not yet aired' },
];
const animeRatingOptions: Array<SelectOption<AnimeSearchRating, AnimeRating>> = [
  { value: 'g', label: 'G - All Ages' },
  { value: 'pg', label: 'PG - Children' },
  { value: 'pg13', label: 'PG-13 - Teens 13 or older' },
  { value: 'r17', label: 'R - 17+ (violence & profanity)' },
  { value: 'r', label: 'R+ - Mild Nudity' },
  { value: 'rx', label: 'Rx - Hentai' },
];
// const animeOrderByOptions: Array<SelectOption<AnimeSearchOrder>> = [
//   { value: 'score', label: 'Score' },
//   { value: 'popularity', label: 'Popularity' },
//   { value: 'favorites', label: 'Favorites' },
//   { value: 'mal_id', label: 'ID' },
// ];

type AnimeSelectValues = {
  type: SelectOption<AnimeType> | null;
  status: SelectOption<AnimeSearchStatus> | null;
  rating: SelectOption<AnimeSearchRating> | null;
  genres: SelectOption<number>[];
};
// type SelectValues = {
//   type: SelectOption<AnimeType> | null;
//   status: SelectOption<AnimeSearchStatus> | null;
//   rating: SelectOption<AnimeSearchRating> | null;
//   genres: SelectOption<number>[];
// };
// type FormValues = SelectValues & {
//   min_score: number | null;
//   max_score: number | null;
// };

// type ExtractOptionValue<T> = T extends SelectOption<infer U>
//   ? U
//   : T extends SelectOption<infer U>[]
//   ? U
//   : never;

// const setSortForOrderBy = (param: keyof AnimeSearchParams): SortOptions | undefined => {
//   const sort: Record<keyof AnimeSearchParams, SortOptions> = {
//     score: 'desc',
//     popularity: 'asc',
//     favorites: 'desc',
//     mal_id: 'asc',
//   };
//   return sort[param];
// };

// const AnimeCatalogPage: React.FC = () => {
//   const location = useLocation();
//   const appNavigate = useAppNavigate({
//     order_by: 'score',
//   });
//   const dispatch = useAppDispatch();

//   const searchParams = React.useMemo<AnimeSearchParams>(() => {
//     const urlParams = parseSearchParams(location.search);
//     if (!urlParams.order_by) urlParams.order_by = 'score';
//     return {
//       ...urlParams,
//       sort: setSortForOrderBy(urlParams.order_by as keyof AnimeSearchParams),
//     };
//   }, [location.search]);

//   const { items: genres, status: genresStatus } = useAppSelector((state) => state.animeGenres);
//   const { items, pagination, status } = useAppSelector((state) => state.animeCatalog);
//   const { isLoading } = useFetchStatus(status);

//   const isTablet = useMatchMedia('max', MEDIA_QUERY.tablet);
//   const [isShowFilters, setIsShowFilters] = React.useState(false);
//   const openFilters = () => setIsShowFilters(true);
//   const closeFilters = () => setIsShowFilters(false);

//   const animeGenresOptions = React.useMemo(() => {
//     return genres.length > 0
//       ? genres.map((obj: Genre) => ({
//           value: obj.mal_id,
//           label: obj.name,
//         }))
//       : [];
//   }, [genres]);

//   const { control, handleSubmit, reset, register } = useForm<FormValues>({
//     defaultValues: getFormDefaulValues(),
//   });

//   const cardsRef = React.useRef<HTMLDivElement>(null);
//   const isFirstRender = useRef(true);

//   // Получить жанры аниме, если их нет
//   React.useEffect(() => {
//     appNavigate(searchParams, { replace: isFirstRender.current });
//     if (genresStatus === FetchStatus.SUCCESS) return;
//     dispatch(fetchAnimeGenres());
//   }, []);

//   // Обновить данные в форме после получения жанров и формирования animeGenresOptions или после смены url-параметров
//   React.useEffect(() => {
//     if (animeGenresOptions.length > 0) reset(getFormDefaulValues());
//   }, [animeGenresOptions, searchParams]);

//   // Получение даных об аниме за указанными параметрами
//   const fetchAnimeController = useRef<AbortController | null>(null);
//   React.useEffect(() => {
//     if (genresStatus === FetchStatus.LOADING) return;

//     fetchAnimeController.current?.abort();
//     fetchAnimeController.current = new AbortController();

//     const urlParams = parseSearchParams(location.search);
//     if (!urlParams.order_by) urlParams.order_by = 'score';
//     dispatch(
//       fetchAnimeByParams(
//         {
//           ...urlParams,
//           sort: setSortForOrderBy(urlParams.order_by as keyof AnimeSearchParams),
//         },
//         { signal: fetchAnimeController.current.signal },
//       ),
//     );

//     return () => {
//       fetchAnimeController.current?.abort();
//     };
//   }, [location.search, genres]);

//   // Проверка значения параметра page при изменении pagination, чтоб он был в пределах (1 - последняя видимая страница в зависимости от запроса)
//   React.useEffect(() => {
//     if (searchParams.page && searchParams.page < 1) {
//       appNavigate({ ...searchParams, page: undefined }, { replace: isFirstRender.current });
//     } else if (
//       pagination &&
//       searchParams.page &&
//       pagination.last_visible_page < searchParams.page
//     ) {
//       appNavigate(
//         { ...searchParams, page: pagination.last_visible_page },
//         { replace: isFirstRender.current },
//       );
//     }
//   }, [pagination]);

//   React.useEffect(() => {
//     if (!isTablet && isShowFilters) setIsShowFilters(false);
//   }, [isTablet]);

//   React.useEffect(() => {
//     if (isFirstRender) isFirstRender.current = false;
//   }, []);

//   // Получить данные с формы
//   function getFormDefaulValues() {
//     return {
//       type: searchParams.type
//         ? animeTypeOptions.find((obj) => obj.value === searchParams.type)
//         : null,
//       status: searchParams.status
//         ? animeStatusOptions.find((obj) => obj.value === searchParams.status)
//         : null,
//       rating: searchParams.rating
//         ? animeRatingOptions.find((obj) => obj.value === searchParams.rating)
//         : null,
//       min_score: searchParams.min_score && +searchParams.min_score ? +searchParams.min_score : null,
//       max_score: searchParams.max_score && +searchParams.max_score ? +searchParams.max_score : null,
//       genres:
//         searchParams.genres && animeGenresOptions
//           ? animeGenresOptions.filter(
//               (obj) =>
//                 searchParams.genres &&
//                 searchParams.genres.split(',').includes(obj.value.toString()),
//             )
//           : [],
//     };
//   }

//   // При сабмите формы собрать с неё данные и сохранить в searchParams
//   const onSubmit = (data: FormValues) => {
//     appNavigate({
//       ...searchParams,
//       type: data.type?.value,
//       status: data.status?.value,
//       rating: data.rating?.value,
//       min_score: data.min_score,
//       max_score: data.max_score,
//       genres: data.genres?.map((g: any) => g.value).join(','),
//       page: undefined,
//     });
//   };

//   // Держать значение для minScore и maxScore в пределах нормы 1-9.99
//   const onScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const min = Number(e.target.min);
//     const max = Number(e.target.max);
//     const value = Number(e.target.value);

//     if (value < min) e.target.value = min.toString();
//     else if (value > max) e.target.value = max.toString();
//     else e.target.value = value.toFixed(2).replace(/\.?0+$/, '');
//   };

//   // Рендер кастомного выпадающего списка
//   function renderSelect<Name extends keyof SelectValues>(
//     name: Name,
//     options: SelectOption<ExtractOptionValue<SelectValues[Name]>>[],
//     placeholder: string,
//     isMulti: SelectValues[Name] extends SelectOption<any>[] ? true : false = false as any,
//   ) {
//     return (
//       <Controller
//         name={name as any}
//         control={control}
//         render={({ field }) => (
//           <Select<SelectOption<ExtractOptionValue<SelectValues[Name]>>, typeof isMulti>
//             {...field}
//             className="filters-item__select select"
//             classNamePrefix="filters-item__select select"
//             options={options}
//             value={field.value}
//             onChange={field.onChange}
//             placeholder={placeholder}
//             menuPortalTarget={isTablet ? null : document.body}
//             isSearchable={false}
//             closeMenuOnSelect={!isMulti}
//             isMulti={isMulti}
//             isClearable
//             unstyled
//           />
//         )}
//       />
//     );
//   }

//   // Рендер сайдбара (фильтров)
//   const renderCatalogSidebar = () => (
//     <aside className={clsx('catalog-cards__sidebar catalog-sidebar', { _show: isShowFilters })}>
//       <div className="catalog-sidebar__inner">
//         <div className="catalog-sidebar__header">
//           <div className="catalog-sidebar__title">Filters</div>
//           <button className="catalog-sidebar__close-btn" onClick={closeFilters}></button>
//         </div>
//         <form onSubmit={handleSubmit(onSubmit)} className="catalog-sidebar__filters">
//           <div className="catalog-sidebar__filters-item filters-item">
//             <div className="filters-item__title">Type</div>
//             {renderSelect('type', animeTypeOptions, 'Select anime type...')}
//           </div>
//           <div className="catalog-sidebar__filters-item filters-item">
//             <div className="filters-item__title">Status</div>
//             {renderSelect('status', animeStatusOptions, 'Select anime status...')}
//           </div>
//           <div className="catalog-sidebar__filters-item filters-item">
//             <div className="filters-item__title">Rating</div>
//             {renderSelect('rating', animeRatingOptions, 'Select anime rating...')}
//           </div>
//           <div className="catalog-sidebar__filters-item filters-item">
//             <div className="filters-item__title">Genre</div>
//             {genresStatus === FetchStatus.LOADING ? (
//               <Skeleton className="select__control " containerClassName="select" />
//             ) : (
//               renderSelect('genres', animeGenresOptions, 'Genres for one anime ...', true)
//             )}
//           </div>

//           <div className="catalog-sidebar__filters-item filters-item">
//             <div className="filters-item__title">
//               Score <span>( 1 - 9.99 )</span>
//             </div>
//             <div className="filters-item__row">
//               <div className="filters-item__score">
//                 <div className="filters-item__input filters-item__input--min">
//                   <input
//                     type="number"
//                     step="0.01"
//                     min={1}
//                     max={9.99}
//                     {...register('min_score', {
//                       min: 1,
//                       max: 9.99,
//                       setValueAs: (value) => {
//                         if (value === '') return null;
//                         const min = 1;
//                         const max = 9.99;

//                         if (value < min) return min;
//                         else if (value > max) return max;
//                         else
//                           return Number(value)
//                             .toFixed(2)
//                             .replace(/\.?0+$/, '');
//                       },
//                     })}
//                   />
//                 </div>
//               </div>
//               <div className="filters-item__score">
//                 <div className="filters-item__input filters-item__input--max">
//                   <input
//                     type="number"
//                     step="0.01"
//                     min={1}
//                     max={9.99}
//                     {...register('max_score', {
//                       min: 1,
//                       max: 9.99,
//                       setValueAs: (v) => (v === '' ? null : parseFloat(v)),
//                       onChange: onScoreChange,
//                     })}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <button className="catalog-sidebar__filters-btn btn btn--outline" type="submit">
//             Search
//           </button>
//           <button
//             className="catalog-sidebar__filters-btn btn btn--outline"
//             type="submit"
//             onClick={() => {
//               appNavigate({ order_by: searchParams.order_by });
//             }}>
//             Clear
//           </button>
//         </form>
//       </div>
//     </aside>
//   );

//   return (
//     <div className="catalog">
//       <CatalogIntro title="Anime Catalog" pagination={pagination} />

//       <div className="catalog__cards catalog-cards" ref={cardsRef}>
//         <div className="container">
//           <div className="catalog-cards__top">
//             <button
//               className="catalog-cards__show-filters btn btn--icon btn--fill"
//               onClick={openFilters}>
//               <FilterIcon />
//               Filters
//             </button>
//             <div className="catalog-cards__sorting catalog-sorting">
//               <span>Sort By:</span>
//               <Select
//                 className="catalog-sorting__select select"
//                 classNamePrefix="select"
//                 placeholder=""
//                 defaultValue={animeOrderByOptions[0]}
//                 value={animeOrderByOptions.find(
//                   (obj) => obj.value === parseSearchParams(location.search).order_by,
//                 )}
//                 options={animeOrderByOptions}
//                 onChange={(selected) => {
//                   appNavigate({ ...searchParams, order_by: selected?.value, page: undefined });
//                 }}
//                 menuPortalTarget={document.body}
//                 isSearchable={false}
//                 unstyled
//               />
//             </div>
//           </div>
//           <div className="catalog-cards__body">
//             {renderCatalogSidebar()}
//             <div className="catalog-cards__content">
//               <div className="catalog-cards__items">
//                 {isLoading
//                   ? Array.from({ length: 24 }).map((_, i) => (
//                       <Skeleton
//                         key={i}
//                         containerClassName="catalog-cards__card _skeleton-container border-opacity"
//                         className=" _skeleton "
//                       />
//                     ))
//                   : uniqueItems(items).map((item) => (
//                       <AnimeCard key={item.mal_id} item={item} className="catalog-cards__card" />
//                     ))}
//               </div>
//               {pagination && (
//                 <Pagination
//                   currentPage={pagination.current_page}
//                   totalItems={pagination.items.total}
//                   itemsPerPage={pagination.items.per_page}
//                   className="catalog-cards__pagination"
//                   onChangePage={(page) => {
//                     appNavigate({ ...searchParams, page: page > 1 ? page : undefined });

//                     if (!cardsRef.current) return;

//                     const tabsTop = cardsRef.current.getBoundingClientRect().top;
//                     if (tabsTop >= 0) return;

//                     window.scrollTo({
//                       top: tabsTop + window.scrollY - 10,
//                       behavior: 'smooth',
//                     });
//                   }}
//                 />
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

const AnimeCatalogPage = () => {
  return (
    <CatalogPage<Anime, AnimeSelectValues>
      introTitle="Anime Catalog"
      selectFilters={[
        {
          selectName: 'type',
          label: 'type',
          options: animeTypeOptions,
          placeholder: 'Select anime type...',
        },
        {
          selectName: 'status',
          label: 'status',
          options: animeStatusOptions,
          placeholder: 'Select anime status...',
        },
        {
          selectName: 'rating',
          label: 'rating',
          options: animeRatingOptions,
          placeholder: 'Select anime rating...',
        },
      ]}
      itemsRelated={{
        actionCreator: fetchAnimeByParams as any,
        selector: (state) => state.animeCatalog,
        status: (state) => state.animeCatalog.status,
      }}
      genresRelated={{
        actionCreator: fetchAnimeGenres,
        selector: (state) => state.animeGenres.items,
        status: (state) => state.animeGenres.status,
      }}
      renderItem={(item) => (
        <AnimeCard key={item.mal_id} item={item} className="catalog-cards__card" />
      )}
    />
  );
};

export default AnimeCatalogPage;
