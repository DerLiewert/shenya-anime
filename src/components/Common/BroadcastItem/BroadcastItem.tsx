import React from 'react';
import { Link } from 'react-router-dom';
import { InfoRow, InfoValue } from '../InfoRowWithValue';
import { Anime } from '@/models';
import { getImageUrl, valueOrDefault } from '@/utils';
import './BroadcastItem.scss';
import clsx from 'clsx';

interface BroadcastItemProps {
  item: Anime;
  className?: string;
}

const BroadcastItem: React.FC<BroadcastItemProps> = ({ item, className }) => {
  return (
    <Link
      to={`/anime/${item.mal_id}`}
      key={item.mal_id}
      className={clsx('broadcast-item border-opacity', className)}>
      <div className="broadcast-item__inner _title-parent">
        <div className="broadcast-item__image bg">
          <img src={getImageUrl(item.images)} alt="Poster" loading="lazy" />
        </div>
        <div className="broadcast-item__body">
          <h4 className="broadcast-item__title title title--fz-14 visible-line" title={item.title}>
            {item.title}
          </h4>
          <ul className="broadcast-item__list">
            <InfoRow name="Episodes" className="broadcast-item__list-item fz-13">
              <InfoValue>{valueOrDefault(item.episodes)}</InfoValue>
            </InfoRow>
            <InfoRow name="Type" className="broadcast-item__list-item fz-13">
              <InfoValue>{item.type}</InfoValue>
            </InfoRow>
            <InfoRow name="Genres" className="broadcast-item__list-item fz-13">
              {item.genres.map((genre, index, arr) => (
                <InfoValue key={genre.mal_id}>
                  {genre.name}
                  {index < arr.length - 1 && ','}
                </InfoValue>
              ))}
            </InfoRow>

            <InfoRow name="Broadcast" className="broadcast-item__list-item fz-13 _broadcast">
              <InfoValue>
                {item.broadcast.time
                  ? `${item.broadcast.time}, ${item.broadcast.timezone}`
                  : 'Unknown'}
              </InfoValue>
            </InfoRow>
          </ul>
        </div>
      </div>
    </Link>
  );
};

export default BroadcastItem;
