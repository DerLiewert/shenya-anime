import React from 'react';
import { fetchPersonPictures } from '@/store';
import { personEmptyValueMessages } from '@/constants';
import { PicturesTab } from '@/components';

const PersonPicturesTab: React.FC = () => {
  return (
    <PicturesTab
      selector={(state) => state.personFullById.pictures}
      status={(state) => state.personFullById.status.pictures}
      emptyValueMessage={personEmptyValueMessages.pictures}
      fetchAction={fetchPersonPictures}
    />
  );
};

export default PersonPicturesTab;
