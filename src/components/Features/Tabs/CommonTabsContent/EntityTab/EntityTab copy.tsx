import React from 'react';
import { useAppSelector } from '@/app/hooks';
import { useAbortableDispatch, useShowMore, useFetchStatus } from '@/hooks';
import { EmptyValueMessage, Loading } from '@/components';

import type { AsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import type { AsyncThunkConfig, FetchStatus, StatusSelector } from '@/typescript';

import './EntityTab.scss';
import { commonMessages } from '@/constants';

type Options<T> = {
  items: T[];
  visibleCount: number;
};

interface EntityTabProps<T> {
  selector: (state: RootState) => T[];
  status: StatusSelector | FetchStatus | undefined;
  fetchAction?: AsyncThunk<T[], any, AsyncThunkConfig>;
  visibleItemCount?: number;
  emptyValueMessage: string;
  itemsBody: (options: Options<T>) => React.ReactNode;
}

const EntityTabx = <T,>(props: EntityTabProps<T>) => {
  const {
    selector,
    status,
    fetchAction,
    emptyValueMessage,
    visibleItemCount = 12,
    itemsBody,
  } = props;

  const abortableDispatch = useAbortableDispatch();
  const items = useAppSelector(selector);
  const { isLoading, isSuccess, isError } = useFetchStatus(status);
  const { visibleCount, showMore } = useShowMore(visibleItemCount);

  React.useEffect(() => {
    if (fetchAction && items.length === 0 && (!isSuccess || !isLoading)) {
      abortableDispatch(fetchAction);
    }
  }, [fetchAction]);

  return (
    <div className="entity-tab">
      {items.length > 0 && itemsBody({ items, visibleCount })}

      {isLoading && <Loading className="entity-tab__message" />}
      {isError && (
        <EmptyValueMessage className="entity-tab__message" message={commonMessages.error} />
      )}
      {isSuccess && items.length === 0 && (
        <EmptyValueMessage className="entity-tab__message" message={emptyValueMessage} />
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

export default EntityTabx;
