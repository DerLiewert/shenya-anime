import React from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useAbortableDispatch, useShowMore } from '@/hooks';
import { EmptyValueMessage, Loading } from '@/components';
import { useFetchStatus } from '@/hooks/useFetchStatus';
import { RootState } from '@/app/store';
import { AsyncThunkConfig, FetchStatus, StatusSelector } from '@/typescript';
import { AsyncThunk } from '@reduxjs/toolkit';
import './EntityTab.scss';

interface EntityTabProps<T> {
  selector: (state: RootState) => T[];
  status: StatusSelector | FetchStatus | undefined;
  actionCreator?: AsyncThunk<T[], any, AsyncThunkConfig>;
  entityItem: (item: T, index: number) => React.ReactNode;
  visibleItemCount?: number;
  emptyValueMessage: string;
}

const EntityTab = <T,>(props: EntityTabProps<T>) => {
  const {
    selector,
    status,
    actionCreator,
    emptyValueMessage,
    visibleItemCount = 12,
    entityItem,
  } = props;

  const abortableDispatch = useAbortableDispatch();
  const items = useAppSelector(selector);
  const { isLoading, isSuccess } = useFetchStatus(status);
  const { visibleCount, showMore } = useShowMore(visibleItemCount);

  React.useEffect(() => {
    if (actionCreator && items.length === 0 && !isSuccess) abortableDispatch(actionCreator);
  }, [actionCreator]);

  if (isLoading) return <Loading />;

  return (
    <div className="entity-tab">
      {isSuccess && items.length > 0 ? (
        <div className="entity-tab__items tab-grid-2">
          {items.slice(0, visibleCount).map(entityItem)}
        </div>
      ) : (
        <EmptyValueMessage message={emptyValueMessage} />
      )}
      {items.length > 0 && items.length > visibleCount && (
        <div className="entity-tab__show-more-wrapper bnts-wrapper">
          <button
            className="entity-tab__show-more show-more-btn btn btn--upper btn--outline"
            onClick={showMore}
            disabled={isLoading}>
            Show more
          </button>
        </div>
      )}
    </div>
  );
};

export default EntityTab;
