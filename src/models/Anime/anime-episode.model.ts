export interface AnimeEpisode {
  mal_id: number;
  url: string | null;
  title: string;
  title_japanese: string | null;
  title_romanji: string | null;
  aired: string | null;
  score: number | null;
  duration: number;
  filler: boolean;
  recap: boolean;
  forum_url: string | null;
}
