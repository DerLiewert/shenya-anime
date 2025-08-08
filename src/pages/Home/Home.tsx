import React from 'react';
import { useAbortableDispatch } from '@/hooks';
import { fetchSeasonalAnime } from '../../store/anime/seasonalAnimeSlice';
import { Intro, MediaBlock, NewEpisodes, RandomAnime } from '@/components';
import './Home.scss'

const Home: React.FC = () => {
  useAbortableDispatch(fetchSeasonalAnime);
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
