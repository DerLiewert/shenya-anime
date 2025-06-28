import React from 'react';
import { useAbortableDispatch, useShowMoreMap, useYoutubeTrailerImage } from '@/hooks';
import { useAppSelector } from '@/app/hooks';
import { fetchAnimeVideos } from '@/store/anime/animeFullByIdSlice';
import { PlayCircleIcon } from '@/components/Icons';
import { SectionHeader } from '@/components/Common';

import LightGallery from 'lightgallery/react';
import lgVideo from 'lightgallery/plugins/video';
import 'lightgallery/scss/lg-video.scss';

import './VideosTab.scss';
import { AnimeYoutubeVideo } from '@/models';
import clsx from 'clsx';
import { EmptyValueMessage, Loading } from '@/components';
import { animeEmptyValueMessages } from '@/variables/emptyValueMessages';
import { useFetchStatus } from '@/hooks/useFetchStatus';

const VideosTab: React.FC<{ id: number }> = ({ id }) => {
  const { videos, status } = useAppSelector((state) => state.animeFullById);
  const { isLoading, isSuccess } = useFetchStatus(status.videos);

  useAbortableDispatch(fetchAnimeVideos, id, !videos && !isSuccess);

  // const { visibleCount: visiblePromoCount, showMore: showMorePromo } = useShowMore(6);
  // const { visibleCount: visibleMusicCount, showMore: showMoreMusic } = useShowMore(6);

  const { visibleCounts, init, showMore } = useShowMoreMap(6);

  React.useEffect(() => {
    if (videos) init(Object.keys(videos));
  }, [videos]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="anime-videos">
          <div className="anime-videos__section">
            <SectionHeader title="Promo Videos" className="anime-videos__section-header" />
            {isSuccess && videos && videos.promo.length > 0 ? (
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
                {videos &&
                  videos.promo
                    .slice(0, visibleCounts.promo)
                    .map((item) => (
                      <YoutubeVideo
                        key={item.trailer.youtube_id}
                        ytVideoideoItem={item.trailer}
                        title={item.title}
                      />
                    ))}
              </LightGallery>
            ) : (
              <EmptyValueMessage message={animeEmptyValueMessages.videos.promotion} />
            )}
            {isSuccess &&
              videos &&
              videos.promo.length > 0 &&
              videos.promo.length > visibleCounts.promo && (
                <div className="anime-videos__show-more-wrapper bnts-wrapper">
                  <button
                    className="anime-videos__show-more show-more-btn btn btn--upper btn--outline"
                    onClick={() => showMore('promo')}
                    disabled={isLoading}>
                    Show more
                  </button>
                </div>
              )}
          </div>
          <div className="anime-videos__section">
            <SectionHeader title="Music Videos" className="anime-videos__section-header" />
            {videos && videos.music_videos.length > 0 ? (
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
                {videos &&
                  videos.music_videos
                    .slice(0, visibleCounts.music_videos)
                    .map((item) => (
                      <YoutubeVideo
                        key={item.video.youtube_id}
                        ytVideoideoItem={item.video}
                        title={item.title}
                      />
                    ))}
              </LightGallery>
            ) : (
              <EmptyValueMessage message={animeEmptyValueMessages.videos.music} />
            )}
            {videos &&
              videos.music_videos.length > 0 &&
              videos.music_videos.length > visibleCounts.music_videos && (
                <div className="anime-videos__show-more-wrapper bnts-wrapper">
                  <button
                    className="anime-videos__show-more show-more-btn btn btn--upper btn--outline"
                    onClick={() => showMore('music_videos')}
                    disabled={isLoading}>
                    Show more
                  </button>
                </div>
              )}
          </div>

          {/* <div className="anime-videos__section">
        <SectionHeader title="Promo Videos" />
        {videos ? (
          <div className="anime-videos__items tab-grid-3">
            {videos &&
              videos.promo.map((item) => (
                <div key={item.trailer.youtube_id} className="anime-videos__item video-item border">
                  <p className="video-item__title">{item.title}</p>
                  <img
                    className="video-item__image"
                    src={item.trailer.images?.maximum_image_url}
                    alt="Video image"
                    aria-hidden
                  />
                  <button className="video-item__play-btn">
                    <PlayCircleIcon />
                    Play
                  </button>
                </div>
              ))}
          </div>
        ) : (
          <p className="anime-details__text">No any video has been added for this anime.</p>
        )}
      </div> */}
        </div>
      )}{' '}
    </>
  );
};

export default VideosTab;

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
