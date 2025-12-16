import { useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import { FetchStatus } from '@/typescript';

type Status = FetchStatus | undefined | null;
type StatusSelector = (state: RootState) => Status;
type ReturnedBase = Record<'isIdle' | 'isLoading' | 'isSuccess' | 'isError', boolean>;

export function useFetchStatus(
  statusOrSelector: StatusSelector | Status,
  withIdle: true,
): {
  isIdle: boolean;
} & ReturnedBase;

export function useFetchStatus(
  statusOrSelector: StatusSelector | Status,
  withIdle?: false,
): ReturnedBase;

export function useFetchStatus(
  statusOrSelector: StatusSelector | Status,
  withIdle: boolean = false,
) {
  const selectedStatus = useAppSelector((state) =>
    typeof statusOrSelector === 'function' ? statusOrSelector(state) : undefined,
  );

  const status = typeof statusOrSelector === 'function' ? selectedStatus : statusOrSelector;

  const base = {
    isSuccess: status === FetchStatus.SUCCESS,
    isError: status === FetchStatus.ERROR,
  };

  return withIdle
    ? {
        isIdle: !status,
        isLoading: status === FetchStatus.LOADING,
        ...base,
      }
    : {
        isLoading: !status || status === FetchStatus.LOADING,
        ...base,
      };
}
