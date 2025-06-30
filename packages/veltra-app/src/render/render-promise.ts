export function renderPromise(
  callback: () => void,
  handler: ((promise: Promise<any>) => void) | undefined,
) {
  try {
    callback();
  } catch (error) {
    if (error instanceof Promise) {
      if (handler) {
        handler(error);
      } else {
        error.then(callback).catch(console.error);
      }
    } else {
      throw error;
    }
  }
}
