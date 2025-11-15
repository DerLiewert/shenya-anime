import React from 'react';
import { PicturesTab } from '@/components';
import { animeEmptyValueMessages } from '@/constants';
import { AnimeFullState, fetchAnimePictures, MangaFullState } from '@/store';
import EntityTabx from '../CommonTabsContent/EntityTab/EntityTab copy';
import { Anime, Character, JikanImages, JikanPaginationPlus, Manga } from '@/models';
import { FetchStatus } from '@/typescript';
import LightGallery from 'lightgallery/react';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import 'lightgallery/scss/lg-thumbnail.scss';
import 'lightgallery/scss/lg-zoom.scss';
import { getImageUrl, isAnimeNsfw } from '@/utils';
import { useAppSelector } from '@/app/hooks';

const AnimePicturesTab: React.FC = () => {
  const item = useAppSelector((state) => state.animeFullById.item);
  return (
    <PicturesTab
      nsfw={item ? isAnimeNsfw(item) : false}
      selector={(state) => state.animeFullById.pictures}
      status={(state) => state.animeFullById.status.pictures}
      emptyValueMessage={animeEmptyValueMessages.pictures}
      fetchAction={fetchAnimePictures}
    />
  );
};

const AnimePicturesTab1: React.FC = () => {
  return (
    <EntityTabx<JikanImages>
      selector={(state) => state.animeFullById.pictures}
      status={(state) => state.animeFullById.status.pictures}
      emptyValueMessage={animeEmptyValueMessages.pictures}
      fetchAction={fetchAnimePictures}
      itemsBody={(options) => {
        return (
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
            {options.items.slice(0, options.visibleCount).map((picture, i) => (
              <a
                key={picture.jpg.image_url}
                href={getImageUrl(picture)}
                className="pictures-tab__item bg bg--dark border">
                <img src={getImageUrl(picture)} alt={`${i}`} loading="lazy" />
              </a>
            ))}
          </LightGallery>
        );
      }}
    />
  );
};

export default AnimePicturesTab;
