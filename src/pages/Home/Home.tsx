import React from 'react';
import {
  AnimeCard,
  MainIntro,
  MangaCard,
  MediaBlock,
  NewEpisodes,
  RandomAnime,
} from '@/components';
import { Anime, animeSeasons, Manga } from '@/models';
import { fetchSeasonalAnime } from '@/store/anime/seasonalAnimeSlice';
import { fetchTopManga } from '@/store/manga/mangaTopSlice';
import './Home.scss';
import { getSeasonName, toFirstUppercase } from '@/utils';
import { commonPaths } from '@/variables';
import { fetchIntroAnime } from '@/store/anime/introAnimeSlice';

const Home: React.FC = () => {
  return (
    <>
      <MainIntro />
      <MediaBlock<Anime>
        type="anime"
        header={{
          title: 'Top Anime',
          link: { url: commonPaths.anime, text: 'View all' },
        }}
        selector={(state) => state.introAnime}
        renderCard={(item) => <AnimeCard item={item} />}
        fetchAction={fetchIntroAnime}
      />
      <MediaBlock<Manga>
        type="manga"
        header={{
          title: 'Top Manga',
          link: { url: commonPaths.manga, text: 'View all' },
        }}
        selector={(state) => state.mangaTop}
        renderCard={(item) => <MangaCard item={item} />}
        fetchAction={fetchTopManga}
      />
      <MediaBlock<Anime>
        type="anime"
        header={{
          title: 'Seasonal anime',
          link: { url: commonPaths.seasonal, text: 'View all' },
        }}
        subtitle={`${toFirstUppercase(getSeasonName())} ${new Date().getFullYear()}`}
        selector={(state) => state.seasonalAnime}
        renderCard={(item) => <AnimeCard item={item} />}
        fetchAction={fetchSeasonalAnime}
      />
      <NewEpisodes />
      <RandomAnime />
    </>
  );
};

export default Home;
