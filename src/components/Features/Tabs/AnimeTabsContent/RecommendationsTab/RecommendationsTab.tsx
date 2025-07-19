import React from 'react';
import { fetchAnimeRecommendations } from '@/store/anime/animeFullByIdSlice';

import { animeEmptyValueMessages } from '@/variables';
import { RecommendationsTab } from '../../CommonTabsContent';
import { AnimeRecommendationCard } from '@/components';
import './RecommendationsTab.scss';

// const RecommendationsTab: React.FC = React.memo(() => {
//   const { recommendations, status } = useAppSelector((state) => state.animeFullById);
//   const { isLoading, isSuccess } = useFetchStatus(status.recommendations);
//   const { visibleCount, showMore } = useShowMore(12);

//   useAbortableDispatch(
//     fetchAnimeRecommendations,
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
//             <EmptyValueMessage message={animeEmptyValueMessages.recommendations} />
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

const AnimeRecommendationsTab = () => {
  return (
    <RecommendationsTab
      selector={(state) => state.animeFullById.recommendations}
      status={(state) => state.animeFullById.status.recommendations}
      actionCreator={fetchAnimeRecommendations}
      entityItem={(item) => <AnimeRecommendationCard item={item.entry} key={item.entry.mal_id} />}
      emptyValueMessage={animeEmptyValueMessages.recommendations}
    />
  );
};

export default AnimeRecommendationsTab;
