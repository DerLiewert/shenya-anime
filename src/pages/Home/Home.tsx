import React from 'react';
import { useAbortableDispatch } from '@/hooks';
import { fetchSeasonalAnime } from '../../store/anime/seasonalAnimeSlice';
import { Intro, MediaBlock, NewEpisodes, RandomAnime } from '@/components';
import './Home.scss'

// const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

// const batchDispatch = async (
//   dispatch: any,
//   actions: (() => any)[],
//   batchSize: number,
//   delay: number,
// ) => {
//   for (let i = 0; i < actions.length; i += batchSize) {
//     const batch = actions.slice(i, i + batchSize);
//     await Promise.all(batch.map((action) => dispatch(action())));
//     if (i + batchSize < actions.length) await sleep(delay);
//   }
// };

const Home: React.FC = () => {
  useAbortableDispatch(fetchSeasonalAnime);
  // React.useEffect(() => {
  //   const actions = [
  //     fetchIntroAnime,
  //     fetchSeasonalAnime,
  //     fetchTodaySchedulesAnime,
  //     fetchRandomAnime,
  //   ];

  //   //  dispatch(fetchIntroAnime())
  //   // batchDispatch(dispatch, actions, 1, 1000); // максимум 4 за раз, потом пауза
  // }, [dispatch]);

  return (
    <React.Fragment>
      <Intro />
      <MediaBlock
        header={{
          title: 'Top Anime',
          link: { url: '#', text: 'View all' },
        }}
        selectFunction={(state) => state.introAnime}
      />
      <MediaBlock
        header={{
          title: 'Seasonal anime',
          link: { url: '#', text: 'View all' },
        }}
        selectFunction={(state) => state.seasonalAnime}
      />
      <NewEpisodes />
      <RandomAnime />
    </React.Fragment>
  );
};

export default Home;
