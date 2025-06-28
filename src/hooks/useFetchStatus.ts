import { useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import { FetchStatus } from '@/types';

type StatusSelector = (state: RootState) => FetchStatus | undefined;

export function useFetchStatus(statusOrSelector: FetchStatus | StatusSelector | undefined) {
  const selectedStatus = useAppSelector((state) =>
    typeof statusOrSelector === 'function' ? statusOrSelector(state) : undefined,
  );

  const status = typeof statusOrSelector === 'function' ? selectedStatus : statusOrSelector;

  return {
    isLoading: status === FetchStatus.LOADING,
    isSuccess: status === FetchStatus.SUCCESS,
    isError: status === FetchStatus.ERROR,
  };
}
