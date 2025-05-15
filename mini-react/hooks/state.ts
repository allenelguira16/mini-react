import { deepEqual, renderObserver } from "../utils";

const stateFactory = (() => {
  let stateIndex = 0;
  let stateList: any[] = [];

  return {
    resetState: () => {
      stateIndex = 0;
    },
    state: <T>(initial: T): [T, (value: T) => void] => {
      const idx = stateIndex++;

      if (!stateList[idx]) {
        stateList[idx] = initial;
      }

      const setState = (newVal: T) => {
        if (deepEqual(stateList[idx], newVal)) return;

        stateList[idx] = newVal;
        renderObserver.update();
      };

      return [stateList[idx], setState] as const;
    },
  };
})();

export const state = stateFactory.state;
export const resetState = stateFactory.resetState;
