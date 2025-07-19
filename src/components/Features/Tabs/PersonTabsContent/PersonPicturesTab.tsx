import React from 'react';
import { PicturesTab } from '../CommonTabsContent/PicturesTab';
import { personEmptyValueMessages } from '@/variables';
import { fetchPersonPictures } from '@/store/person/personFullByIdSlice';

const PersonPicturesTab: React.FC = () => {
  return (
    <PicturesTab
      selector={(state) => state.personFullById.pictures}
      status={(state) => state.personFullById.status.pictures}
      emptyValueMessage={personEmptyValueMessages.pictures}
      actionCreator={fetchPersonPictures}
    />
  );
};

export default PersonPicturesTab;
