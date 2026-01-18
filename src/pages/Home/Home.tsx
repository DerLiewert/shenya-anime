import React from 'react';
import {
  AnimeCard,
  MainIntro,
  MangaCard,
  MediaBlock,
  NewEpisodes,
  RandomAnime,
} from '@/components';
import { appPaths } from '@/resources';
import { getSeasonName, toFirstUppercase } from '@/utils';
import { fetchIntroAnime, fetchSeasonalAnime, fetchTopManga } from '@/store';
import './Home.scss';
import { usePageScrollToTop } from '@/hooks';

const Home = () => {
  usePageScrollToTop();
  return (
    <>
      <MainIntro />
      <MediaBlock
        type="anime"
        header={{
          title: 'Top Anime',
          link: { url: appPaths.anime, text: 'View all' },
        }}
        selector={(state) => state.topAnime}
        renderCard={(item) => <AnimeCard item={item} />}
        fetchAction={fetchIntroAnime}
      />
      <MediaBlock
        type="manga"
        header={{
          title: 'Top Manga',
          link: { url: appPaths.manga, text: 'View all' },
        }}
        selector={(state) => state.mangaTop}
        renderCard={(item) => <MangaCard item={item} />}
        fetchAction={fetchTopManga}
      />
      <MediaBlock
        type="anime"
        header={{
          title: 'Seasonal anime',
          link: { url: appPaths.seasonal, text: 'View all' },
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
