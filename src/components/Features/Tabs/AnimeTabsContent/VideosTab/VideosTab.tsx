import React from 'react';
import { useAppSelector } from '@/app/hooks';
import {
  useAbortableDispatch,
  useShowMoreMap,
  useYoutubeTrailerImage,
  useFetchStatus,
} from '@/hooks';
import { SectionHeader, EmptyValueMessage, Loading, PlayCircleIcon } from '@/components';
import { AnimeYoutubeVideo } from '@/models';

import LightGallery from 'lightgallery/react';
import lgVideo from 'lightgallery/plugins/video';
import 'lightgallery/scss/lg-video.scss';

import clsx from 'clsx';
import './VideosTab.scss';
import { fetchAnimeVideos } from '@/store';
import { animeEmptyValueMessages, commonMessages } from '@/constants';

const VideosTab: React.FC = () => {
  const abortableDispatch = useAbortableDispatch();
  const { videos, status } = useAppSelector((state) => state.animeFullById);
  const { isLoading, isSuccess, isError } = useFetchStatus(status.videos);
  const { visibleCounts, initShowMore, showMore } = useShowMoreMap(6);

  React.useEffect(() => {
    if (!videos && (!isSuccess || !isLoading)) abortableDispatch(fetchAnimeVideos);
  }, []);

  React.useEffect(() => {
    if (videos) initShowMore(Object.keys(videos));
  }, [videos]);

  if (isLoading) return <Loading />;

  return (
    <div className="anime-videos">
      <div className="anime-videos__section">
        <SectionHeader title="Promo Videos" className="anime-videos__section-header" />
        {videos && videos.promo.length > 0 ? (
          <>
            <LightGallery
              addClass="anime-video-gallery"
              elementClassNames="anime-videos__items"
              licenseKey="7EC452A9-0CFD441C-BD984C7C-17C8456E"
              plugins={[lgVideo]}
              speed={300}
              download={false}
              youTubePlayerParams={{
                rel: 0,
                autoplay: 1,
                mute: 0,
              }}
              mobileSettings={{
                showCloseIcon: true,
                download: false,
                controls: false,
              }}>
              {videos.promo.slice(0, visibleCounts.promo).map((item) => (
                <YoutubeVideo
                  key={item.trailer.youtube_id}
                  ytVideoideoItem={item.trailer}
                  title={item.title}
                />
              ))}
            </LightGallery>
            {videos.promo.length > visibleCounts.promo && (
              <div className="anime-videos__show-more-wrapper bnts-wrapper">
                <button
                  className="anime-videos__show-more show-more-btn btn btn--upper btn--outline"
                  onClick={() => showMore('promo')}
                  disabled={isLoading}>
                  Show more
                </button>
              </div>
            )}
          </>
        ) : (
          <EmptyValueMessage
            message={isError ? commonMessages.error : animeEmptyValueMessages.videos.promotion}
          />
        )}
      </div>

      <div className="anime-videos__section">
        <SectionHeader title="Music Videos" className="anime-videos__section-header" />
        {videos && videos.music_videos.length > 0 ? (
          <>
            <LightGallery
              addClass="anime-video-gallery"
              elementClassNames="anime-videos__items"
              licenseKey="7EC452A9-0CFD441C-BD984C7C-17C8456E"
              plugins={[lgVideo]}
              speed={300}
              download={false}
              youTubePlayerParams={{
                rel: 0,
                autoplay: 1,
                mute: 0,
              }}
              mobileSettings={{
                showCloseIcon: true,
                download: false,
                controls: false,
              }}>
              {videos.music_videos.slice(0, visibleCounts.music_videos).map((item) => (
                <YoutubeVideo
                  key={item.video.youtube_id}
                  ytVideoideoItem={item.video}
                  title={item.title}
                />
              ))}
            </LightGallery>
            {videos.music_videos.length > visibleCounts.music_videos && (
              <div className="anime-videos__show-more-wrapper bnts-wrapper">
                <button
                  className="anime-videos__show-more show-more-btn btn btn--upper btn--outline"
                  onClick={() => showMore('music_videos')}
                  disabled={isLoading}>
                  Show more
                </button>
              </div>
            )}
          </>
        ) : (
          <EmptyValueMessage message={animeEmptyValueMessages.videos.music} />
        )}
      </div>
    </div>
  );
};

export default VideosTab;

/* ========================
====== YoutubeVideo ======
======================== */
interface YoutubeVideoProps {
  ytVideoideoItem: AnimeYoutubeVideo;
  title: string;
}
const YoutubeVideo: React.FC<YoutubeVideoProps> = ({ ytVideoideoItem, title }) => {
  const { src, onLoad, isFallback } = useYoutubeTrailerImage(ytVideoideoItem.images);
  return (
    <a
      key={ytVideoideoItem.youtube_id}
      className="anime-videos__item video-item border bg"
      data-src={ytVideoideoItem.url}>
      <p className="video-item__title">{title}</p>
      {src && (
        <img
          className={clsx('video-item__image', { '_not-found': isFallback })}
          src={src}
          onLoad={onLoad}
          alt={title}
          aria-hidden
          loading="lazy"
        />
      )}
      <button className="video-item__play-btn">
        <PlayCircleIcon />
        Play
      </button>
    </a>
  );
};
