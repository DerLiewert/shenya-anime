import React from 'react';
import { PicturesTab } from '../CommonTabsContent/PicturesTab';
import { characterEmptyValueMessages } from '@/variables';
import { fetchCharacterPictures } from '@/store/character/characterFullByIdSlice';

const CharacterPicturesTab: React.FC = () => {
  return (
    <PicturesTab
      selector={(state) => state.characterFullById.pictures}
      status={(state) => state.characterFullById.status.pictures}
      emptyValueMessage={characterEmptyValueMessages.pictures}
      fetchAction={fetchCharacterPictures}
    />
  );
};

export default CharacterPicturesTab;
