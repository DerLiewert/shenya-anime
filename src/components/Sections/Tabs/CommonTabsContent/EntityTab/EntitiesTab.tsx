import React, { JSX } from 'react';
import clsx from 'clsx';
import { useAppSelector } from '@/app/hooks';
import { AsyncThunkConfig } from '@/app/appAsyncThunk';
import { useAbortableDispatch, useShowMore, useFetchStatus } from '@/hooks';
import { commonMessages } from '@/constants';
import { EmptyValueMessage, Loading } from '@/components';

import type { AsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import type { FetchStatus, StatusSelector } from '@/typescript';

import './EntityTab.scss';

export type EntitiesTabProps<T> = CommonEntitiesTabProps<T> &
  (WithRenderItems<T> | WithItemsBody<T>);

export type CommonEntitiesTabProps<T> = {
  selector: (state: RootState) => T[];
  status: StatusSelector | FetchStatus | undefined;
  fetchAction?: AsyncThunk<T[], any, AsyncThunkConfig>;
  visibleItemCount?: number;
  emptyValueMessage: string;
  itemsBodyClass?: string;
};

type WithRenderItems<T> = {
  items: (options: Options<T>) => JSX.Element[];
  itemsBody?: never;
};

type WithItemsBody<T> = {
  items?: never;
  itemsBody: (options: Options<T>) => JSX.Element;
};

type Options<T> = {
  items: T[];
  visibleCount: number;
};

export const EntitiesTab = <T,>(props: EntitiesTabProps<T>) => {
  const {
    selector,
    status,
    fetchAction,
    emptyValueMessage,
    visibleItemCount = 12,
    itemsBody,
    itemsBodyClass,
    items: renderItems,
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
      {items.length > 0 &&
        (itemsBody ? (
          itemsBody({ items, visibleCount })
        ) : (
          <div className={clsx('entity-tab__items', itemsBodyClass)}>
            {renderItems({ items, visibleCount })}
          </div>
        ))}

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
