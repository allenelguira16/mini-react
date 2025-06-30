import { State } from "~/reactivity";

export let stateContext: {
  states: State<any>[];
  index: number;
} | null = null;

/**
 * set the state context
 *
 * @param newStateContext - The state context.
 */
export function setStateContext(
  newStateContext: {
    states: State<any>[];
    index: number;
  } | null = null,
) {
  stateContext = newStateContext;
}

const stateMap = new Map<any, Map<any, { states: any[] }>>();

/**
 * create a state context
 *
 * @param type - The type of the state.
 * @param key - The key of the state.
 * @returns The state context.
 */
export const createStateContext = (
  type: (props: Record<string, any>) => any,
  key?: number | string,
) => {
  let instance: { states: any[] };

  if (key !== undefined) {
    if (!stateMap.has(type)) {
      stateMap.set(type, new Map());
    }
    const typeMap = stateMap.get(type)!;
    if (!typeMap.has(key)) {
      typeMap.set(key, { states: [] });
    }
    instance = typeMap.get(key)!;
  } else {
    instance = { states: [] };
  }

  return { ...instance, index: 0 };
};
