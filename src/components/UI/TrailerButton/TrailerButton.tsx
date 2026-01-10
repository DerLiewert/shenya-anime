import { PlayCircleIcon } from '@/components';
import { AnimeYoutubeVideo } from '@/typescript';
import { LG_LICENSE_KEY } from '@/constants';

import LightGallery from 'lightgallery/react';
import lgVideo from 'lightgallery/plugins/video';
import 'lightgallery/scss/lg-zoom.scss';
import 'lightgallery/scss/lg-video.scss';

import './TrailerButton.scss';
import clsx from 'clsx';

interface TrailerButtonProps {
  trailer: AnimeYoutubeVideo;
  className?: string;
  lightGalleryClass?: string;
}

export const TrailerButton = ({ trailer, className, lightGalleryClass }: TrailerButtonProps) => {
  return (
    <LightGallery
      addClass={lightGalleryClass}
      licenseKey={LG_LICENSE_KEY}
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
