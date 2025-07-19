import React from 'react';
import { mangaEmptyValueMessages } from '@/variables';
import { fetchMangaRecommendations } from '@/store/manga/mangaFullByIdSlice';
import { RecommendationsTab } from '../../CommonTabsContent';
import { MangaRecommendationCard } from '@/components/Common';
import './RecommendationsTab.scss';

// const RecommendationsTab: React.FC = React.memo(() => {
//   const { recommendations, status } = useAppSelector((state) => state.mangaFullById);
//   const { isLoading, isSuccess } = useFetchStatus(status.recommendations);
//   const { visibleCount, showMore } = useShowMore(12);

//   useAbortableDispatch(
//     fetchMangaRecommendations,
//     undefined,
//     recommendations.length === 0 && !isSuccess,
//   );

//   return (
//     <>
//       {isLoading ? (
//         <Loading />
//       ) : (
//         <div className="anime-recommendations">
//           {isSuccess && recommendations.length > 0 ? (
//             <div className="anime-recommendations__items ">
//               {recommendations.slice(0, visibleCount).map((item) => (
//                 <RecommendationAnimeCard
//                   key={item.entry.mal_id}
//                   item={item.entry}
//                   className="anime-recommendations__item"
//                 />
//               ))}
//             </div>
//           ) : (
//             <EmptyValueMessage message={mangaEmptyValueMessages.recommendations} />
//           )}
//           {recommendations.length > 0 && recommendations.length > visibleCount && (
//             <div className="anime-recommendations__show-more-wrapper bnts-wrapper">
//               <button
//                 className="anime-recommendations__show-more show-more-btn btn btn--upper btn--outline"
//                 onClick={showMore}
//                 disabled={isLoading}>
//                 Show more
//               </button>
//             </div>
//           )}
//         </div>
//       )}
//     </>
//   );
// });

const MangaRecommendationsTab = () => {
  return (
    <RecommendationsTab
      selector={(state) => state.mangaFullById.recommendations}
      status={(state) => state.mangaFullById.status.recommendations}
      actionCreator={fetchMangaRecommendations}
      entityItem={(item => <MangaRecommendationCard item={item.entry} key={item.entry.mal_id}/>)}
      emptyValueMessage={mangaEmptyValueMessages.recommendations}
    />
  );
};

export default MangaRecommendationsTab;
