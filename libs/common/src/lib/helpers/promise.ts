/* eslint-disable @typescript-eslint/no-magic-numbers */
export const delay = async (ms: number): Promise<void> => {
  if (ms <= 0) {
    throw new Error('Invalid delay time')
  }
  return new Promise((resolve: any) => setTimeout(resolve, ms))
}

const DEFAULT_RETRY_DELAY = 1000

export const retry = async <T>(
  functionToRetry: () => Promise<T>,
  retries: number,
  time: number = DEFAULT_RETRY_DELAY,
): Promise<T> => {
  return functionToRetry().catch(async (error: Error) => {
    const shouldRetry = retries > 0
    return shouldRetry
      ? delay(time).then(async () => retry(functionToRetry, retries - 1, time))
      : Promise.reject(error)
  })
}
