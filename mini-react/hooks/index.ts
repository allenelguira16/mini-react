import { resetEffects } from "./effect";
import { resetState } from "./state";

export function resetHooks() {
  resetState();
  resetEffects();
}

export { state } from "./state";
export { effect, runEffects } from "./effect";
