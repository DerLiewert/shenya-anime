export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && Object.keys(value).length === 0) return true;

  return false;
};

export const randomInteger = (min: number, max: number): number => {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  ms: number = 150,
): (...args: Parameters<T>) => ReturnType<T> {
  let isThrottled = false;
  let savedArgs: any[] | null = null;
  let savedThis: any = null;

  function wrapper(this: any, ...args: any[]) {
    if (isThrottled) {
      savedArgs = args;
      savedThis = this;
      return;
    }

    func.apply(this, args);
    isThrottled = true;

    setTimeout(() => {
      isThrottled = false;
      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = savedThis = null;
      }
    }, ms);
  }

  return wrapper as T;
}
