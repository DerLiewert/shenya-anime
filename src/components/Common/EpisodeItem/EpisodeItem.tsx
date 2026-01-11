import { StarIcon } from '@/components/Icons';
import { fallbackValues } from '@/constants';
import { AnimeEpisode } from '@/typescript';
import { formattedScore } from '@/utils';
import './EpisodeItem.scss';

export const EpisodeItem: React.FC<{ episode: AnimeEpisode }> = ({ episode }) => {
  return (
    <div className="anime-episodes__item episode-item border">
      <div className="episode-item__top">
        <span className="episode-item__label">EP: {episode.mal_id}</span>
        {(episode.recap || episode.filler) && (
          <p className="episode-item__labels">
            {episode.recap && <span className="episode-item__label _recap">Recap</span>}
            {episode.filler && <span className="episode-item__label _filler">Filler</span>}
          </p>
        )}
      </div>
      <div className="episode-item__content">
        <h3 className="episode-item__title visible-line" title={episode.title}>
          {episode.title}
        </h3>
        {episode.title_japanese && (
          <h4 className="episode-item__sub-title visible-line" title={episode.title_japanese}>
            {episode.title_japanese}
          </h4>
        )}
      </div>
      <div className="episode-item__bottom">
        <div className="episode-item__date">
          {episode.aired ? episode.aired.split('T')[0] : fallbackValues.unknown}
        </div>
        <div className="episode-item__score">
          <StarIcon />
          <p>
            {formattedScore(episode.score)}
            <span>/ 5</span>
          </p>
        </div>
      </div>
    </div>
  );
};
