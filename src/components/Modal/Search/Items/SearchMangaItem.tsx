import React from 'react';
import { Link } from 'react-router-dom';
import { InfoRow, InfoValue, Score, SfwImage, Status } from '@/components';
import { fallbackValues } from '@/constants';
import { getImageUrl, isMangaNsfw, valueOrDefault } from '@/utils';
import { appPaths } from '@/resources';
import { Manga } from '@/typescript';
import './SearchItem.scss';

export const SearchMangaItem: React.FC<{ item: Manga }> = ({ item }) => {
  return (
    <Link to={appPaths.mangaFull(item.mal_id)} className="search-modal__item search-item">
      <SfwImage
        classWrapper="search-item__image"
        nsfw={isMangaNsfw(item)}
        src={getImageUrl(item.images)}
        alt="Poster"
        loading="lazy"
        aria-hidden
      />
      <div className="search-item__content">
        <div className="search-item__labels">
          <Score className="search-item__label search-item__label--score" score={item.score} />
          <Status className="search-item__label search-item__label--status" status={item.status} />
        </div>
        <div className="search-item__top">
          <div className="search-item__title title title--fz-14 visible-line">{item.title}</div>
        </div>
        <div className="search-item__info">
          <InfoRow name="Type">
            <InfoValue>{valueOrDefault(item.type)}</InfoValue>
            {item.published.prop.from.year && (
              <InfoValue>{item.published.prop.from.year}</InfoValue>
            )}
          </InfoRow>

          <InfoRow name="Chapters">
            <InfoValue>{valueOrDefault(item.chapters, fallbackValues.mark)}</InfoValue>
          </InfoRow>

          <InfoRow name={item.genres.length > 1 ? 'Genres' : 'Genre'}>
            {item.genres.length > 0 ? (
              item.genres.map((genre) => <InfoValue key={genre.mal_id}>{genre.name}</InfoValue>)
            ) : (
              <InfoValue>{fallbackValues.unknown}</InfoValue>
            )}
          </InfoRow>
        </div>
      </div>
    </Link>
  );
};

