import React from 'react';
import { Link } from 'react-router-dom';
import { InfoRow, InfoValue, Score, Status } from '@/components';
import { Manga } from '@/models';
import { getImageUrl } from '@/utils';
import { SpecialStatus } from '@/variables';

const SearchMangaItem: React.FC<{ item: Manga }> = ({ item }) => {
  return (
    <Link to={`manga/${item.mal_id}`} className="search-modal__item search-item">
      <div className="search-item__image bg">
        <img src={getImageUrl(item.images)} alt="Poster" aria-hidden />
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
            <InfoValue>{item.type ? item.type : SpecialStatus.Unknown}</InfoValue>
            {item.published.prop.from.year && item.published.prop.from.year}
          </InfoRow>
          {item.chapters && (
            <InfoRow name="Chapters">
              <InfoValue>{item.chapters}</InfoValue>
            </InfoRow>
          )}
          {item.genres.length > 0 && (
            <InfoRow name={item.genres.length > 1 ? 'Genres' : 'Genre'}>
              {item.genres.map((genre) => (
                <InfoValue key={genre.mal_id}>{genre.name}</InfoValue>
              ))}
            </InfoRow>
          )}
        </div>
      </div>
    </Link>
  );
};

export default SearchMangaItem;
