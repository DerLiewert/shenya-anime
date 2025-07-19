import React from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useShowMore } from '@/hooks';
import { EmptyValueMessage, Loading } from '@/components';
import { useFetchStatus } from '@/hooks/useFetchStatus';
import { RootState } from '@/app/store';
import { FetchStatus } from '@/types';
import { AsyncThunk } from '@reduxjs/toolkit';
import './EntityTab.scss';

type StatusSelector = (state: RootState) => FetchStatus | undefined;

interface EntityTabProps<T> {
  selector: (state: RootState) => T[];
  status: StatusSelector | FetchStatus | undefined;
  actionCreator?: AsyncThunk<T[], any, { state: RootState; rejectValue: string }>;
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

  const dispatch = useAppDispatch();
  const items = useAppSelector(selector);
  const { isLoading, isSuccess } = useFetchStatus(status);
  const { visibleCount, showMore } = useShowMore(visibleItemCount);

  React.useEffect(() => {
    if (!actionCreator || !(items.length === 0 && !isSuccess)) return;

    const controller = new AbortController();
    dispatch(actionCreator(actionCreator, { signal: controller.signal }));

    return () => {
      controller.abort();
    };
  }, [actionCreator]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
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
      )}
    </>
  );
};

export default EntityTab;
