import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// type RequestFn<T> = () => Promise<T>;

// interface ScheduledTask<T> {
//   run: () => void;
//   signal?: AbortSignal;
//   meta?: { label?: string; url?: string };
// }

// class RequestLimiter {
//   private queue: ScheduledTask<any>[] = [];
//   private interval: number;
//   private maxRequestsPerInterval: number;
//   private requestsThisInterval = 0;
//   private isPaused = false;

//   constructor(requestsPerSecond: number) {
//     this.interval = 1000;
//     this.maxRequestsPerInterval = requestsPerSecond;

//     setInterval(() => {
//       if (!this.isPaused) {
//         this.requestsThisInterval = 0;
//         this.runQueue();
//       }
//     }, this.interval);
//   }

//   public schedule<T>(
//     fn: RequestFn<T>,
//     signal?: AbortSignal,
//     meta?: { label?: string; url?: string },
//   ): Promise<T> {
//     return new Promise((resolve, reject) => {
//       const abortHandler = () => {
//         console.log(`[Limiter] ❌ Aborted before run ${meta?.label ?? meta?.url ?? ''}`);
//         this.queue = this.queue.filter((task) => task.run !== run);
//         reject(new DOMException('Aborted', 'AbortError'));
//       };

//       const run = () => {
//         if (signal?.aborted) {
//           console.log(`[Limiter] ⚠️ Skipped run (aborted): ${meta?.label ?? meta?.url ?? ''}`);
//           reject(new DOMException('Aborted', 'AbortError'));
//           return;
//         }

//         signal?.removeEventListener('abort', abortHandler);
//         console.log(`[Limiter] 🚀 Running request: ${meta?.label ?? meta?.url ?? ''}`);

//         fn()
//           .then((res) => {
//             console.log(`[Limiter] ✅ Success: ${meta?.label ?? meta?.url ?? ''}`);
//             resolve(res);
//           })
//           .catch((error) => {
//             if (this.isRateLimitError(error)) {
//               console.warn(`[Limiter] 🧯 429 Rate limit hit on: ${meta?.label ?? meta?.url ?? ''}`);
//               this.pause(2000);
//             }
//             console.log('error.name', error.name);
//             if (axios.isCancel(error) || error.name === 'AbortError') {
//               console.log(
//                 `[Limiter] 🚫 Request aborted after start: ${meta?.label ?? meta?.url ?? ''}`,
//               );
//             } else {
//               console.log(
//                 `[Limiter] ❌ Failed: ${meta?.label ?? meta?.url ?? ''}`,
//               );
//             }
//             reject(error);
//           });
//       };

//       if (signal?.aborted) {
//         console.log(`[Limiter] ❌ Aborted before enqueue: ${meta?.label ?? meta?.url ?? ''}`);
//         reject(new DOMException('Aborted', 'AbortError'));
//         return;
//       }

//       signal?.addEventListener('abort', abortHandler);
//       console.log(`[Limiter] 📥 Enqueued: ${meta?.label ?? meta?.url ?? ''}`);

//       this.queue.push({ run, signal, meta });
//       this.runQueue();
//     });
//   }

//   private runQueue() {
//     const remaining = this.maxRequestsPerInterval - this.requestsThisInterval;

//     for (let i = 0; i < remaining && this.queue.length > 0; ) {
//       const task = this.queue.shift();
//       if (!task) continue;

//       const { run, signal } = task;

//       if (signal?.aborted) {
//         console.log('[Limiter] 🗑️ Skipped aborted request in queue');
//         continue;
//       }

//       run();
//       this.requestsThisInterval++;
//       i++;
//     }
//   }

//   private isRateLimitError(error: any): boolean {
//     return (
//       error?.response?.status === 429 ||
//       error?.status === 429 ||
//       error?.code === 'ERR_TOO_MANY_REQUESTS'
//     );
//   }

//   private pause(ms: number) {
//     this.isPaused = true;
//     setTimeout(() => {
//       this.isPaused = false;
//       this.runQueue();
//     }, ms);
//   }
// }

// const limiter = new RequestLimiter(3);
// export default limiter;

// export function limitedAxios<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
//   return limiter.schedule(() => axios(config));
// }

type RequestFn<T> = () => Promise<T>;

interface ScheduledTask<T> {
  run: () => void;
  signal?: AbortSignal;
  meta?: { label?: string; url?: string };
  retriesLeft: number;
}

// class RequestLimiter {
//   private queue: ScheduledTask<any>[] = [];
//   private isPaused = false;
//   private intervalMs: number;
//   private lastRunTime = 0;

//   constructor(requestsPerSecond: number) {
//     this.intervalMs = Math.floor(1000 / requestsPerSecond);
//     this.tick();
//   }

//   public schedule<T>(
//     fn: RequestFn<T>,
//     signal?: AbortSignal,
//     meta?: { label?: string; url?: string },
//   ): Promise<T> {
//     return new Promise((resolve, reject) => {
//       const abortHandler = () => {
//         console.log(`[Limiter] ❌ Aborted before run ${meta?.label ?? meta?.url ?? ''}`);
//         this.queue = this.queue.filter((task) => task.run !== run);
//         reject(new DOMException('Aborted', 'AbortError'));
//       };

//       const run = () => {
//         console.log('this', this.queue);
//         if (signal?.aborted) {
//           console.log(`[Limiter] ⚠️ Skipped run (aborted): ${meta?.label ?? meta?.url ?? ''}`);
//           reject(new DOMException('Aborted', 'AbortError'));
//           return;
//         }

//         signal?.removeEventListener('abort', abortHandler);
//         console.log(`[Limiter] 🚀 Running request: ${meta?.label ?? meta?.url ?? ''}`);

//         fn()
//           .then((res) => {
//             console.log(`[Limiter] ✅ Success: ${meta?.label ?? meta?.url ?? ''}`);
//             resolve(res);
//           })
//           .catch((error) => {
//             if (this.isRateLimitError(error)) {
//               console.warn(`[Limiter] 🧯 429 Rate limit hit on: ${meta?.label ?? meta?.url ?? ''}`);

//               if (task.retriesLeft > 0) {
//                 const retryTask: ScheduledTask<any> = {
//                   run,
//                   signal,
//                   meta,
//                   retriesLeft: task.retriesLeft - 1,
//                 };

//                 setTimeout(() => {
//                   console.log(`[Limiter] 🔁 Retrying after 429: ${meta?.label ?? meta?.url ?? ''}`);

//                   if (this.queue.length > 1) {
//                     this.queue.splice(1, 0, retryTask);
//                   } else {
//                     this.queue.unshift(retryTask);
//                   }
//                 }, 1000);

//                 this.pause(2000);
//               } else {
//                 console.log(
//                   `[Limiter] ❌ Gave up after retries: ${meta?.label ?? meta?.url ?? ''}`,
//                 );
//                 reject(error);
//               }
//               return;
//             }

//             if (axios.isCancel(error) || error.name === 'AbortError') {
//               console.log(
//                 `[Limiter] 🚫 Request aborted after start: ${meta?.label ?? meta?.url ?? ''}`,
//               );
//             } else {
//               console.log(`[Limiter] ❌ Failed: ${meta?.label ?? meta?.url ?? ''}`);
//             }
//             reject(error);
//           });
//       };

//       if (signal?.aborted) {
//         console.log(`[Limiter] ❌ Aborted before enqueue: ${meta?.label ?? meta?.url ?? ''}`);
//         reject(new DOMException('Aborted', 'AbortError'));
//         return;
//       }

//       signal?.addEventListener('abort', abortHandler);
//       console.log(`[Limiter] 📥 Enqueued: ${meta?.label ?? meta?.url ?? ''}`);

//       const task: ScheduledTask<any> = { run, signal, meta, retriesLeft: 3 };
//       this.queue.push(task);
//     });
//   }

//   private tick() {
//     setInterval(() => {
//       if (this.isPaused || this.queue.length === 0) return;

//       const now = Date.now();
//       if (now - this.lastRunTime < this.intervalMs) return;

//       const task = this.queue.shift();
//       if (!task) return;

//       const { run, signal } = task;
//       if (signal?.aborted) {
//         console.log('[Limiter] 🗑️ Skipped aborted request in queue');
//         return;
//       }

//       this.lastRunTime = now;
//       run();
//     }, 50);
//   }

//   private isRateLimitError(error: any): boolean {
//     return (
//       error?.response?.status === 429 ||
//       error?.status === 429 ||
//       error?.code === 'ERR_TOO_MANY_REQUESTS'
//     );
//   }

//   private pause(ms: number) {
//     this.isPaused = true;
//     setTimeout(() => {
//       this.isPaused = false;
//     }, ms);
//   }
// }

class RequestLimiter {
  private queue: ScheduledTask<any>[] = [];
  private isPaused = false;
  private intervalMs: number;
  private lastRunTime = 0;
  private intervalId: NodeJS.Timeout | null = null; // <- чтобы можно было остановить
  private isTicking = false;

  constructor(requestsPerSecond: number) {
    this.intervalMs = Math.floor(1000 / requestsPerSecond);
  }

  private startTicking() {
    if (this.isTicking) return;
    this.isTicking = true;

    this.intervalId = setInterval(() => {
      if (this.isPaused) return;

      if (this.queue.length === 0) {
        this.stopTicking();
        return;
      }

      const now = Date.now();
      if (now - this.lastRunTime < this.intervalMs) return;

      const task = this.queue.shift();
      if (!task) return;

      const { run, signal } = task;
      if (signal?.aborted) {
        console.log('[Limiter] 🗑️ Skipped aborted request in queue');
        return;
      }

      this.lastRunTime = now;
      run();
    }, 50);
  }

  private stopTicking() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isTicking = false;
  }

  public schedule<T>(
    fn: RequestFn<T>,
    signal?: AbortSignal,
    meta?: { label?: string; url?: string },
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const abortHandler = () => {
        this.queue = this.queue.filter((task) => task.run !== run);
        reject(new DOMException('Aborted', 'AbortError'));
      };

      const run = () => {
        if (signal?.aborted) {
          reject(new DOMException('Aborted', 'AbortError'));
          return;
        }

        signal?.removeEventListener('abort', abortHandler);

        fn()
          .then(resolve)
          .catch((error) => {
            if (this.isRateLimitError(error)) {
              if (task.retriesLeft > 0) {
                const retryTask: ScheduledTask<any> = {
                  run,
                  signal,
                  meta,
                  retriesLeft: task.retriesLeft - 1,
                };

                setTimeout(() => {
                  if (this.queue.length > 1) {
                    this.queue.splice(1, 0, retryTask);
                  } else {
                    this.queue.unshift(retryTask);
                  }
                  this.startTicking(); // <- вдруг тикер уже остановился
                }, 1000);

                this.pause(500);
              } else {
                reject(error);
              }
              return;
            }

            reject(error);
          });
      };

      if (signal?.aborted) {
        reject(new DOMException('Aborted', 'AbortError'));
        return;
      }

      signal?.addEventListener('abort', abortHandler);

      const task: ScheduledTask<any> = { run, signal, meta, retriesLeft: 3 };
      this.queue.push(task);

      this.startTicking(); // <- запускаем тикер, если он ещё не крутится
    });
  }

  private pause(ms: number) {
    this.isPaused = true;
    setTimeout(() => {
      this.isPaused = false;
    }, ms);
  }

  private isRateLimitError(error: any): boolean {
    return (
      error?.response?.status === 429 ||
      error?.status === 429 ||
      error?.code === 'ERR_TOO_MANY_REQUESTS'
    );
  }
}

const limiter = new RequestLimiter(3); // 2 запроса в секунду (1 каждые ~333мс)
export default limiter;

export function limitedAxios<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
  return limiter.schedule(() => axios(config));
}
