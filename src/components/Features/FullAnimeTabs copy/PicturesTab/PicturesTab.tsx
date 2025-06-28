import React from 'react';
import { useAbortableDispatch, useShowMore } from '@/hooks';
import { useAppSelector } from '@/app/hooks';
import { fetchAnimePictures } from '@/store/anime/animeFullByIdSlice';

import LightGallery from 'lightgallery/react';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import 'lightgallery/scss/lg-thumbnail.scss';
import 'lightgallery/scss/lg-zoom.scss';

import './PicturesTab.scss';
import { EmptyValueMessage, Loading } from '@/components';
import { animeEmptyValueMessages } from '@/variables/emptyValueMessages';
import { useFetchStatus } from '@/hooks/useFetchStatus';

const PicturesTab: React.FC<{ id: number }> = React.memo(({ id }) => {
  const { pictures, status } = useAppSelector((state) => state.animeFullById);
  const { isLoading, isSuccess } = useFetchStatus(status.pictures);
  const { visibleCount, showMore } = useShowMore(12);

  useAbortableDispatch(fetchAnimePictures, id, pictures.length === 0 && !isSuccess);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="anime-pictures">
          {isSuccess && pictures.length > 0 ? (
            <LightGallery
              addClass="anime-pictures-gallery"
              elementClassNames="anime-pictures__items"
              licenseKey="7EC452A9-0CFD441C-BD984C7C-17C8456E"
              plugins={[lgThumbnail, lgZoom]}
              speed={300}
              thumbHeight={'60px'}
              thumbWidth={80}
              mobileSettings={{
                showCloseIcon: true,
                download: true,
                controls: false,
              }}>
              {pictures.slice(0, visibleCount).map((picture, i) => (
                <a
                  key={picture.jpg.image_url}
                  href={picture.webp?.large_image_url}
                  className="anime-pictures__item bg bg--dark border">
                  <img src={picture.webp?.large_image_url} alt={`${i}`} loading="lazy" />
                </a>
              ))}
            </LightGallery>
          ) : (
            <EmptyValueMessage message={animeEmptyValueMessages.pictures} />
          )}
          {pictures.length > 0 && pictures.length > visibleCount && (
            <div className="anime-pictures__show-more-wrapper bnts-wrapper">
              <button
                className="anime-pictures__show-more show-more-btn btn btn--upper btn--outline"
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
});

export default PicturesTab;
