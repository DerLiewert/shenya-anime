import { JikanSearchParams, sortOptions, SortOptions } from '@/models';

const validateScore = (value: string | number): number | undefined => {
  const number = Number(value);
  const isValid = !isNaN(number) && number >= 1 && number < 10;
  return isValid ? number : undefined;
};

const validateGenres = (v: string) => {
  const filtered = v
    .split(',')
    .filter((x) => /^\d+$/.test(x))
    .join(',');
  return filtered || undefined;
};

export const paramValuesAsArray: Array<keyof JikanSearchParams> = ['genres', 'genres_exclude'];

//========================================================================================================================================================
export const commonParamsValidators: ParamsValidators<JikanSearchParams> = {
  min_score: validateScore,
  max_score: validateScore,
  score: validateScore,
  genres: validateGenres,
  genres_exclude: validateGenres,
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
function isRange(value: unknown): value is { from: number; to: number } {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    'from' in value &&
    'to' in value
  );
}

//========================================================================================================================================================
export type ParamParser<T> = (value: string) => T | undefined;

export type ParamsValidators<T> = {
  [P in keyof T]?: ParamParser<T[P]>;
};

export type ParamRule<T> =
  | true // разрешён без ограничений
  | false // запрещён
  | {
      include?: [NonNullable<T>] extends [number]
        ? readonly T[] | { from: NonNullable<T>; to: NonNullable<T> }
        : readonly T[]; // разрешённые значения
      exclude?: readonly T[]; // запрещённые значения
    };

export interface AllowedParams<T extends object> {
  // Если true - все параметры разрешены, кроме тех, что явно запрещены (false)
  allAllowed?: boolean;
  // Правила для конкретных параметров
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
        // if (rule.include && !rule.include.includes(val)) return false;
        if (rule.include) {
          if (Array.isArray(rule.include) && !rule.include.includes(val)) return false;
          if (isRange(rule.include) && (val < rule.include.from || val > rule.include.to))
            return false;
        }
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
