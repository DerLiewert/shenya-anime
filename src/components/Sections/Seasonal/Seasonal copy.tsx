import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { AnimeCard, InfoRow, InfoValue, Loading } from '@/components';
import { useAbortableDispatch, useAppNavigate, useFetchStatus } from '@/hooks';
import { animeSeasons } from '@/models';
import { fetchSeasonsList } from '@/store/season/seasonListSlice';
import { fetchSeasonsAnime } from '@/store/season/seasonsAnimeSlice';
import { getImageUrl, uniqueItems, valueOrDefault } from '@/utils';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Select from 'react-select';
import './Seasonal.scss';

type SelectOption<T, L = string> = {
  value: T;
  label: L;
};

// const seasonOptions = animeSeasons.map((str) => ({ value: str, label: str }));

// function Seasonal() {
//   const dispatch = useAppDispatch();
//   const location = useLocation();
//   const appNavigate = useAppNavigate({year: new Date().getFullYear(), season: 'summer'})
//   const {
//     items,
//     pagination,
//     season: prevSeason,
//     status,
//   } = useAppSelector((state) => state.seasonsAnime);
//   const seasonsList = useAppSelector((state) => state.seasonsList.items);
//   const { isLoading } = useFetchStatus(status);

//   React.useEffect(() => {
//     dispatch(fetchSeasonsList());
//   }, []);

//   const yearOptions = React.useMemo(
//     () => seasonsList.map((obj) => ({ value: obj.year, label: obj.year })),
//     [seasonsList],
//   );

//   const [year, setYear] = React.useState({
//     value: new Date().getFullYear(),
//     label: new Date().getFullYear(),
//   });
//   const [season, setSeason] = React.useState<SelectOption<animeSeasons>>({ value: 'summer', label: 'summer' });

//   const param = React.useMemo(
//     () => ({ year: year.value, season: season.value, page: 1 }),
//     [year?.value, season.value],
//   );
//   useAbortableDispatch(
//     fetchSeasonsAnime,
//     param,
//     isLoading || prevSeason?.year !== year.value || prevSeason?.season !== season.value,
//   );

//   const onShowMore = () => {
//     if (pagination && pagination.has_next_page) {
//       dispatch(
//         fetchSeasonsAnime({
//           year: year.value,
//           season: season.value,
//           page: pagination.current_page + 1,
//         }),
//       );
//     }
//   };
//   return (
//     <div className="seasonal">
//       <div className="container">
//         <div className="seasonal__tabs">
//           <div className="seasonal__tab">Currently Airing</div>
//           <div className="seasonal__tab" aria-selected="true">
//             Seasonal Anime
//           </div>
//         </div>
//         <div className="seasonal__body">
//           <div className="seasonal__filter">
//             {yearOptions.length > 0 && (
//               <Select
//                 className="seasonal__select select"
//                 classNamePrefix="select"
//                 placeholder=""
//                 defaultValue={yearOptions[0]}
//                 value={year}
//                 options={yearOptions}
//                 onChange={(selected) => {
//                   setYear(selected as any);
//                 }}
//                 menuPortalTarget={document.body}
//                 isSearchable={false}
//                 unstyled
//               />
//             )}
//             {seasonOptions && seasonOptions.length > 0 && (
//               <Select
//                 className="seasonal__select select"
//                 classNamePrefix="select"
//                 placeholder=""
//                 defaultValue={seasonOptions[0]}
//                 value={season}
//                 options={seasonOptions}
//                 onChange={(selected) => {
                  
//                   setSeason(selected as any);
//                 }}
//                 menuPortalTarget={document.body}
//                 isSearchable={false}
//                 unstyled
//               />
//             )}
//           </div>
//           <div className="seasonal__items ">
//             {uniqueItems(items).map((item) => (
//               <AnimeCard item={item} />
//             ))}
//           </div>
//           {isLoading && <Loading className='seasonal__loader'/>}
//           {items.length > 0 && pagination?.has_next_page && (
//             <div className="seasonal__show-more-wrapper bnts-wrapper">
//               <button
//                 className="seasonal__show-more show-more-btn btn btn--upper btn--outline"
//                 onClick={onShowMore}
//                 disabled={isLoading}>
//                 Show more
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Seasonal;
