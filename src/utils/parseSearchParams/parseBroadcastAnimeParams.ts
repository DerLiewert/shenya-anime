import { SchedulesFilter, schedulesFilter, SchedulesParams } from '@/models';
import {
  AllowedParams,
  commonParamsValidators,
  parseSearchParams,
  ParamsValidators,
} from './parseSearchParams';

export const broadcastParamsValidators: ParamsValidators<SchedulesParams> = {
  page: commonParamsValidators.page,
  limit: commonParamsValidators.limit,
  sfw: commonParamsValidators.sfw,
  unapproved: commonParamsValidators.unapproved,
  kids: (v) => v === 'true',
  filter: (v) =>
    schedulesFilter.includes(v as SchedulesFilter) ? (v as SchedulesFilter) : undefined,
};

export const parseBroadcastAnimeParams =
  <K extends readonly (keyof SchedulesParams)[]>(allowedKeys: AllowedParams<SchedulesParams>) =>
  (search: string) =>
    parseSearchParams<SchedulesParams, K[number]>(search, broadcastParamsValidators, allowedKeys);
