import clsx from 'clsx';
import { JikanImages } from '@/typescript';
import { LG_LICENSE_KEY } from '@/constants';
import { getImageUrl } from '@/utils';
import { EntitiesTab, EntitiesTabProps, SfwImage } from '@/components';

import LightGallery from 'lightgallery/react';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import 'lightgallery/scss/lg-thumbnail.scss';
import 'lightgallery/scss/lg-zoom.scss';

import './PicturesTab.scss';

type PicturesTabProps<T extends JikanImages> = Omit<EntitiesTabProps<T>, 'itemsBody' | 'items'> & {
  nsfw?: boolean;
};

export const PicturesTab = <T extends JikanImages>(props: PicturesTabProps<T>) => {
  const entitiesTabProps: EntitiesTabProps<T> = {
    ...props,
    itemsBody: (options) => (
      <LightGallery
        addClass="pictures-tab-gallery"
        elementClassNames={clsx('pictures-tab__items', props.itemsBodyClass)}
        licenseKey={LG_LICENSE_KEY}
        plugins={[lgThumbnail, lgZoom]}
        speed={300}
        thumbHeight={'60px'}
        thumbWidth={80}
        mobileSettings={{
          showCloseIcon: true,
          download: true,
          controls: false,
        }}>
        {options.items.slice(0, options.visibleCount).map((picture, i) => (
          <a
            key={picture.jpg.image_url}
            href={getImageUrl(picture)}
            className={'pictures-tab__item border'}>
            <SfwImage
              classWrapper="pictures-tab__image"
              nsfw={props.nsfw || false}
              src={getImageUrl(picture)}
              alt={`${i}`}
              loading="lazy"
            />
          </a>
        ))}
      </LightGallery>
    ),
  };

  return <EntitiesTab<T> {...entitiesTabProps} />;
};
