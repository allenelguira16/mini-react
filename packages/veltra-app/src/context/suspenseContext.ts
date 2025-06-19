export const suspenseContext: SuspenseInstance[] = [];

export function getCurrentSuspense() {
  return suspenseContext[suspenseContext.length - 1];
}

export function setCurrentSuspense(suspense: SuspenseInstance | null) {
  if (suspense) suspenseContext.push(suspense);
  else suspenseContext.pop();
}

export type SuspenseInstance = {
  // called when a child throws promise
  handlePromise: (p: Promise<any>) => void;
};
