import React from 'react';
import { useAppSelector } from '@/app/hooks';
import { useAbortableDispatch, useShowMore, useFetchStatus } from '@/hooks';
import { EmptyValueMessage, Loading, SfwImage } from '@/components';
import { JikanImages } from '@/models';
import { getImageUrl } from '@/utils';

import type { RootState } from '@/app/store';
import type { AsyncThunk } from '@reduxjs/toolkit';
import type { AsyncThunkConfig, FetchStatus, StatusSelector } from '@/typescript';

import LightGallery from 'lightgallery/react';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import 'lightgallery/scss/lg-thumbnail.scss';
import 'lightgallery/scss/lg-zoom.scss';

import './PicturesTab.scss';
import { commonMessages } from '@/constants';
import clsx from 'clsx';

interface ImagesTabProps {
  nsfw?: boolean;
  visibleCount?: number;
  emptyValueMessage: string;
  selector: (state: RootState) => JikanImages[];
  status: StatusSelector | FetchStatus | undefined;
  fetchAction: AsyncThunk<JikanImages[], any, AsyncThunkConfig>;
}

const PicturesTab: React.FC<ImagesTabProps> = ({
  nsfw = false,
  selector,
  fetchAction,
  status,
  emptyValueMessage,
  visibleCount: visibleImagesCount = 12,
}) => {
  const abortableDispatch = useAbortableDispatch();
  const pictures = useAppSelector(selector);
  const { isLoading, isSuccess, isError } = useFetchStatus(status);
  const { visibleCount, showMore } = useShowMore(visibleImagesCount);

  React.useEffect(() => {
    if (pictures.length === 0 && (!isSuccess || !isLoading)) abortableDispatch(fetchAction);
  }, []);

  return (
    <div className="pictures-tab">
      {pictures.length > 0 && (
        <LightGallery
          addClass="pictures-tab-gallery"
          elementClassNames="pictures-tab__items"
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
              href={getImageUrl(picture)}
              className={clsx('pictures-tab__item border')} // 'pictures-tab__item--nsfw': nsfw,
            >
              <SfwImage
                classWrapper="pictures-tab__image"
                nsfw={nsfw}
                src={getImageUrl(picture)}
                alt={`${i}`}
                loading="lazy"
              />
            </a>
          ))}
        </LightGallery>
      )}

      {isLoading && <Loading className="pictures-tab__message" />}
      {isError && (
        <EmptyValueMessage className="pictures-tab__message" message={commonMessages.error} />
      )}
      {isSuccess && pictures.length === 0 && (
        <EmptyValueMessage className="pictures-tab__message" message={emptyValueMessage} />
      )}

      {pictures.length > 0 && pictures.length > visibleCount && (
        <div className="pictures-tab__show-more-wrapper bnts-wrapper">
          <button
            className="pictures-tab__show-more show-more-btn btn btn--upper btn--outline"
            onClick={showMore}
            disabled={isLoading}>
            Show more
          </button>
        </div>
      )}
    </div>
  );
};

export default PicturesTab;
