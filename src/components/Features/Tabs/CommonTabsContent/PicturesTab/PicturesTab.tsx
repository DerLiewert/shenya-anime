import React from 'react';
import { useAppSelector } from '@/app/hooks';
import { useAbortableDispatch, useShowMore, useFetchStatus } from '@/hooks';
import { EmptyValueMessage, Loading } from '@/components';
import { JikanImages } from '@/models';
import { getImageUrl } from '@/utils';
import { commonMessages } from '@/variables';

import type { RootState } from '@/app/store';
import type { AsyncThunk } from '@reduxjs/toolkit';
import type { AsyncThunkConfig, FetchStatus, StatusSelector } from '@/typescript';

import LightGallery from 'lightgallery/react';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import 'lightgallery/scss/lg-thumbnail.scss';
import 'lightgallery/scss/lg-zoom.scss';

import './PicturesTab.scss';

interface ImagesTabProps {
  visibleCount?: number;
  emptyValueMessage: string;
  selector: (state: RootState) => JikanImages[];
  status: StatusSelector | FetchStatus | undefined;
  fetchAction: AsyncThunk<JikanImages[], any, AsyncThunkConfig>;
}

const PicturesTab: React.FC<ImagesTabProps> = ({
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

  if (isLoading) return <Loading />;

  return (
    <div className="pictures-tab">
      {isSuccess && pictures.length > 0 ? (
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
              className="pictures-tab__item bg bg--dark border">
              <img src={getImageUrl(picture)} alt={`${i}`} loading="lazy" />
            </a>
          ))}
        </LightGallery>
      ) : (
        <EmptyValueMessage message={isError ? commonMessages.error : emptyValueMessage} />
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
