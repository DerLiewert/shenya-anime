import React from 'react';
import { PicturesTab } from '@/components';
import { mangaEmptyValueMessages } from '@/variables';
import { fetchMangaPictures } from '@/store/manga/mangaFullByIdSlice';

const MangaPicturesTab: React.FC = () => {
  return (
    <PicturesTab
      selector={(state) => state.mangaFullById.pictures}
      status={(state) => state.mangaFullById.status.pictures}
      emptyValueMessage={mangaEmptyValueMessages.pictures}
      fetchAction={fetchMangaPictures}
    />
  );
};

export default MangaPicturesTab;
