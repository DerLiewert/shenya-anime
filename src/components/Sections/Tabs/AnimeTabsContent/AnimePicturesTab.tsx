import { useAppSelector } from '@/app/hooks';
import { fetchAnimePictures } from '@/store';
import { animeEmptyValueMessages } from '@/constants';
import { isAnimeNsfw } from '@/utils';
import { PicturesTab } from '@/components';

import 'lightgallery/scss/lg-thumbnail.scss';
import 'lightgallery/scss/lg-zoom.scss';

export const AnimePicturesTab = () => {
  const item = useAppSelector((state) => state.animeFullById.item);
  return (
    <PicturesTab
      fetchAction={fetchAnimePictures}
      selector={(state) => state.animeFullById.pictures}
      status={(state) => state.animeFullById.status.pictures}
      emptyValueMessage={animeEmptyValueMessages.pictures}
      nsfw={item ? isAnimeNsfw(item) : false}
    />
  );
};
