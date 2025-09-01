import React from 'react';
import { useAbortableDispatch } from '@/hooks';
import { fetchSeasonalAnime } from '../../store/anime/seasonalAnimeSlice';
import {
  AnimeCard,
  MainIntro,
  MangaCard,
  MediaBlock,
  NewEpisodes,
  RandomAnime,
} from '@/components';
import './Home.scss';
import { Anime, Manga } from '@/models';
import { fetchTopManga } from '@/store/manga/mangaTopSlice';

const Home: React.FC = () => {
  return (
    <React.Fragment>
      <MainIntro />
      <MediaBlock<Anime>
        type='anime'
        header={{
          title: 'Top Anime',
          link: { url: '/anime', text: 'View all' },
        }}
        selectFunction={(state) => state.introAnime}
        renderCard={(item) => <AnimeCard item={item} />}
      />
      <MediaBlock<Manga>
        type='manga'
        header={{
          title: 'Top Manga',
          link: { url: '/manga', text: 'View all' },
        }}
        selectFunction={(state) => state.mangaTop}
        renderCard={(item) => <MangaCard item={item} />}
        actionCreator={fetchTopManga}
      />
      <MediaBlock<Anime>
        type='anime'
        header={{
          title: 'Seasonal anime',
          link: { url: '/schedules/seasonal', text: 'View all' },
        }}
        selectFunction={(state) => state.seasonalAnime}
        renderCard={(item) => <AnimeCard item={item} />}
        actionCreator={fetchSeasonalAnime}
      />
      <NewEpisodes />
      <RandomAnime />
    </React.Fragment>
  );
};

export default Home;
