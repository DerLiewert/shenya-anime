import React from 'react';
import { useAppSelector } from '@/app/hooks';
import { fetchAnimeCharacters } from '@/store/anime/animeFullByIdSlice';
import { SpecialStatus } from '@/variables';

import './CharactersTab.scss';
import { useAbortableDispatch, useShowMore } from '@/hooks';
import { EmptyValueMessage, Loading } from '@/components';
import { animeEmptyValueMessages } from '@/variables/emptyValueMessages';
import { useFetchStatus } from '@/hooks/useFetchStatus';
import { Link } from 'react-router-dom';

const CharactersTab: React.FC<{ id: number }> = ({ id }) => {
  const { characters, status } = useAppSelector((state) => state.animeFullById);
  const { isLoading, isSuccess } = useFetchStatus(status.characters);
  const { visibleCount, showMore } = useShowMore();

  useAbortableDispatch(fetchAnimeCharacters, id, characters.length === 0 && !isSuccess);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="anime-characters">
          {isSuccess && characters.length > 0 ? (
            <div className="anime-characters__items tab-grid-2">
              {characters.slice(0, visibleCount).map((item) => (
                <Link
                  key={item.character.mal_id}
                  to="#"
                  className="anime-characters__item character-item border">
                  <div className="character-item__image bg bg--dark">
                    <img
                      src={item.character.images.webp?.image_url}
                      alt="Character image"
                      loading="lazy"
                      aria-hidden
                    />
                  </div>
                  <div className="character-item__content">
                    <h3 className="character-item__name title visible-line">
                      {item.character.name}
                    </h3>
                    <p className="character-item__role">{item.role}</p>
                    <div className="character-item__voice">
                      V/A:{' '}
                      <span>
                        {item.voice_actors[0]
                          ? item.voice_actors[0]?.person.name
                          : SpecialStatus.Unknown}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyValueMessage message={animeEmptyValueMessages.characters} />
          )}
          {characters.length > 0 && characters.length > visibleCount && (
            <div className="anime-characters__show-more-wrapper bnts-wrapper">
              <button
                className="anime-characters__show-more show-more-btn btn btn--upper btn--outline"
                onClick={showMore}
                disabled={isLoading}>
                Show more
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default CharactersTab;
