import React from 'react';
import { Link } from 'react-router-dom';
import { InfoRow, InfoValue, SfwImage } from '@/components';
import { getImageUrl, isAnimeNsfw, valueOrDefault } from '@/utils';
import { specialStatus } from '@/constants';
import { appPaths } from '@/resources';
import { Anime } from '@/typescript';
import clsx from 'clsx';
import './BroadcastItem.scss';

interface BroadcastItemProps {
  item: Anime;
  className?: string;
}

const BroadcastItem: React.FC<BroadcastItemProps> = ({ item, className }) => {
  return (
    <Link
      to={appPaths.animeFull(item.mal_id)}
      key={item.mal_id}
      className={clsx(className, 'broadcast-item border-opacity _title-parent')}>
      <SfwImage
        classWrapper="broadcast-item__image"
        src={getImageUrl(item.images)}
        nsfw={isAnimeNsfw(item)}
        alt="Poster"
        loading="lazy"
        isBgClass
      />
      <div className="broadcast-item__body">
        <h4 className="broadcast-item__title title title--fz-14 visible-line" title={item.title}>
          {item.title}
        </h4>
        <ul className="broadcast-item__list">
          <InfoRow name="Episodes" className="broadcast-item__list-item fz-13">
            <InfoValue>{valueOrDefault(item.episodes, specialStatus.mark)}</InfoValue>
          </InfoRow>

          <InfoRow name="Type" className="broadcast-item__list-item fz-13">
            <InfoValue>{valueOrDefault(item.type)}</InfoValue>
          </InfoRow>

          <InfoRow name="Genres" className="broadcast-item__list-item fz-13">
            {item.genres.length > 0
              ? item.genres.map((genre, index, arr) => (
                  <InfoValue key={genre.mal_id}>
                    {genre.name}
                    {index < arr.length - 1 && ','}
                  </InfoValue>
                ))
              : specialStatus.unknown}
          </InfoRow>

          <InfoRow name="Broadcast" className="broadcast-item__list-item fz-13 _broadcast">
            <InfoValue>
              {item.broadcast.time
                ? `${item.broadcast.time}, ${item.broadcast.timezone}`
                : specialStatus.unknown}
            </InfoValue>
          </InfoRow>
        </ul>
      </div>
    </Link>
  );
};

export default BroadcastItem;
