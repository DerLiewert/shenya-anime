export enum FetchStatus {
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}

export type NullableFetchStatus = FetchStatus | undefined | null;
