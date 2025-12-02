import LightGallery from 'lightgallery/react';
import lgVideo from 'lightgallery/plugins/video';
import { PlayCircleIcon } from '@/components/Icons';
import { AnimeYoutubeVideo } from '@/models';
import 'lightgallery/scss/lg-zoom.scss';
import 'lightgallery/scss/lg-video.scss';
import clsx from 'clsx';

interface TrailerButton {
  trailer: AnimeYoutubeVideo;
  className?: string;
  lightGalleryClass?: string;
}

export const TrailerButton: React.FC<TrailerButton> = ({
  trailer,
  className,
  lightGalleryClass,
}) => {
  return (
    <LightGallery
      addClass={lightGalleryClass}
      licenseKey="7EC452A9-0CFD441C-BD984C7C-17C8456E"
      plugins={[lgVideo]}
      download={false}
      controls={false}
      counter={false}
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
      <button
        className={clsx(className, 'btn btn--upper btn--icon btn--stroke')}
        data-src={trailer.url || trailer.embed_url}>
        <PlayCircleIcon />
        watch trailer
      </button>
    </LightGallery>
  );
};
