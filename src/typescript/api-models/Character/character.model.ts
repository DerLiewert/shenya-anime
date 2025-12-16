import type {
  CharacterRole,
  CharacterVoiceActor,
  JikanEntity,
  JikanImages,
} from '../Common';

export interface Character {
  mal_id: number;
  url: string;
  images: JikanImages;
  name: string;
  name_kanji: string | null;
  nicknames: string[];
  favorites: number;
  about: string | null;
}

export interface CharacterFull extends Character {
  anime: CharacterAnime[];
  manga: CharacterManga[];
  voices: CharacterVoiceActor[];
}

export interface CharacterAnime {
  role: CharacterRole;
  anime: JikanEntity & { title: string };
}

export interface CharacterManga {
  role: CharacterRole;
  manga: JikanEntity & { title: string };
}
