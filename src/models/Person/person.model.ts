import type { JikanImages, CharacterRole, JikanEntity } from '../Common';

export interface Person {
  mal_id: number;
  url: string;
  website_url: string | null;
  images: JikanImages;
  name: string;
  given_name: string | null;
  family_name: string | null;
  alternate_names: string[];
  birthday: string | null;
  favorites: number;
  about: string | null;
}

export interface PersonFull extends Person {
  anime: PersonAnime[];
  manga: PersonManga[];
  voices: PersonVoices[];
}

export interface PersonAnime {
  position: string;
  anime: JikanEntity & { title: string };
}

export interface PersonManga {
  position: string;
  manga: JikanEntity & { title: string };
}

export interface PersonVoices {
  role: CharacterRole;
  anime: JikanEntity & { title: string };
  character: JikanEntity & { name: string };
}
