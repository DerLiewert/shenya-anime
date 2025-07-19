import type { JikanImages, CharacterRole, CommonCharacterData } from '../Common';

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
  anime: CommonPersonData & { title: string };
}

export interface PersonManga {
  position: string;
  manga: CommonPersonData & { title: string };
}

export interface CommonPersonData {
  mal_id: number;
  url: string;
  images: JikanImages;
}

export interface PersonVoices {
  role: CharacterRole;
  anime: CommonPersonData & { title: string };
  character: CommonCharacterData & { name: string };
}
