import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '@/utils';
import { appPaths } from '@/resources';
import { Character } from '@/typescript';
import './SearchItem.scss';

export const SearchCharacterItem: React.FC<{ item: Character }> = ({ item }) => {
  return (
    <Link to={appPaths.characterFull(item.mal_id)} className="search-modal__item search-item">
      <div className="search-item__image bg">
        <img src={getImageUrl(item.images)} alt="Poster" loading="lazy" aria-hidden />
      </div>
      <div className="search-item__content">
        <div className="search-item__top">
          <div className="search-item__title title title--fz-14">{item.name}</div>
          <div className="search-item__title title--fz-14">{item.name_kanji}</div>
        </div>
      </div>
    </Link>
  );
};
