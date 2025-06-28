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
