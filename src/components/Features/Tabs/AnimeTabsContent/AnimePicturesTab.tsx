import React from 'react';
import { PicturesTab } from '@/components';
import { fetchAnimePictures } from '@/store/anime/animeFullByIdSlice';
import { animeEmptyValueMessages } from '@/variables';

const AnimePicturesTab: React.FC = () => {
  return (
    <PicturesTab
      selector={(state) => state.animeFullById.pictures}
      status={(state) => state.animeFullById.status.pictures}
      emptyValueMessage={animeEmptyValueMessages.pictures}
      fetchAction={fetchAnimePictures}
    />
  );
};

export default AnimePicturesTab;
