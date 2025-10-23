import { JikanSearchParams, sortOptions, SortOptions } from '@/models';

const isValidScore = (value: string | number): boolean => {
  const n = Number(value);
  return !isNaN(n) && n >= 1 && n < 10;
};

const isValidGenres = (v: string) => {
  const filtered = v
    .split(',')
    .filter((x) => /^\d+$/.test(x))
    .join(',');
  return filtered || undefined;
};

// const isValidNumber = (v: string) => {
//   return isFinite(+v) ? +v : undefined;
// };

export const paramValuesAsArray = ['genres', 'genres_exclude'];

//========================================================================================================================================================
export const commonParamsValidators: ParamsValidators<JikanSearchParams> = {
  min_score: (v) => (isValidScore(v) ? Number(v) : undefined),
  max_score: (v) => (isValidScore(v) ? Number(v) : undefined),
  score: (v) => (isValidScore(v) ? Number(v) : undefined),
  genres: isValidGenres,
  genres_exclude: isValidGenres,
  page: (v) => (isFinite(+v) ? +v : undefined),
  limit: (v) => {
    const limit = +v;
    if (isFinite(limit)) {
      return limit > 25 ? 25 : limit < 1 ? 1 : limit;
    }
    return undefined;
  },

  sfw: (v) => v === 'true',
  unapproved: (v) => v === 'true',

  sort: (v) => (sortOptions.includes(v as any) ? (v as SortOptions) : undefined),
  letter: (v) => v,
  start_date: (v) => v,
  end_date: (v) => v,
  q: (v) => v,
};

//========================================================================================================================================================
export type ParamParser<T> = (value: string) => T | undefined;

export type ParamsValidators<T> = {
  [P in keyof T]?: ParamParser<T[P]>;
};

export type ParamRule<T> =
  | true // разрешён без ограничений
  | false // запрещён
  | {
      include?: readonly T[]; // разрешённые значения
      exclude?: readonly T[]; // запрещённые значения
    };

export interface AllowedParams<T extends object> {
  /** Если true - все параметры разрешены, кроме тех, что явно запрещены (false) */
  allAllowed?: boolean;
  /** Правила для конкретных параметров */
  rules?: { [P in keyof T]?: ParamRule<T[P]> };
}

export function parseSearchParams<T extends object, K extends keyof T = keyof T>(
  searchParams: string | {},
  paramsValidators: ParamsValidators<T>,
  allowedParams: AllowedParams<T> = { allAllowed: true },
): Partial<Pick<T, K>> {
  const params = new URLSearchParams(searchParams);
  const result = {} as Partial<Pick<T, K>>;
  const { allAllowed, rules } = allowedParams;

  for (const entry of params.entries()) {
    const [key, value] = entry as [K, string];
    const rule = rules?.[key] as ParamRule<T[K]> | undefined;

    // разрешены только указанныеы параметры и в URL есть параметр, которого нет в разрешённых allowedParam.rules
    if (!allAllowed && !rule) continue;

    // параметр запрещён
    if (rule === false) continue;

    // функция для проверки на валидность значения по ключу
    const paramValidator = paramsValidators[key];
    if (!paramValidator) continue;

    // проверенное значение по ключу
    const checkedValue = paramValidator(value);
    if (checkedValue === undefined || checkedValue === null) continue;

    // если параметр (rule) - обьект, значит есть запрещёные или разрешёные значения для него
    if (typeof rule === 'object') {
      const checkAllowed = (val: any) => {
        if (rule.include && !rule.include.includes(val)) return false;
        if (rule.exclude && rule.exclude.includes(val)) return false;
        return true;
      };

      // если значение параметра массив (?genres=1,22,34)
      if (paramValuesAsArray.includes(key as any)) {
        const filtered = value
          .split(',')
          .map((x) => x.trim())
          .filter((x) => /^\d+$/.test(x))
          .filter((x) => checkAllowed(x));

        if (filtered.length === 0) continue;
        result[key] = filtered.join(',') as T[K];
      } else {
        if (checkAllowed(checkedValue)) result[key] = checkedValue;
      }
    } else {
      result[key] = checkedValue;
    }
  }

  return result;
}
