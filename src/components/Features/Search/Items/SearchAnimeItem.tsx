import React from 'react';
import { Link } from 'react-router-dom';
import { InfoRow, InfoValue, Score, SfwImage, Status } from '@/components';
import { specialStatus } from '@/constants';
import { getImageUrl, getShortAnimeRating, isAnimeNsfw, valueOrDefault } from '@/utils';
import { appPaths } from '@/resources';
import { Anime } from '@/models';
import './SearchItem.scss';

const SearchAnimeItem: React.FC<{ item: Anime }> = ({ item }) => {
  return (
    <Link to={appPaths.animeFull(item.mal_id)} className="search-modal__item search-item">
      <div className="search-item__image bg">
        <SfwImage
          nsfw={isAnimeNsfw(item)}
          src={getImageUrl(item.images)}
          alt="Poster"
          loading="lazy"
          aria-hidden
        />
      </div>
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
            {item.rating && (
              <InfoValue isPrimaryColor title={item.rating}>
                {getShortAnimeRating(item.rating)}
              </InfoValue>
            )}
            {item.aired.prop.from.year && <InfoValue>{item.aired.prop.from.year}</InfoValue>}
          </InfoRow>

          <InfoRow name="Episodes">
            <InfoValue>{valueOrDefault(item.episodes, specialStatus.mark)}</InfoValue>
            {item.duration && item.duration !== 'Unknown' && (
              <InfoValue>{<span>( {item.duration} )</span>}</InfoValue>
            )}
          </InfoRow>

          <InfoRow name={item.genres.length > 1 ? 'Genres' : 'Genre'}>
            {item.genres.length > 0 ? (
              item.genres.map((genre) => <InfoValue key={genre.mal_id}>{genre.name}</InfoValue>)
            ) : (
              <InfoValue>{specialStatus.unknown}</InfoValue>
            )}
          </InfoRow>
        </div>
      </div>
    </Link>
  );
};

export default SearchAnimeItem;
