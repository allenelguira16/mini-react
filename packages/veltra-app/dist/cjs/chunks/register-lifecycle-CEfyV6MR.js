'use strict';

exports.destroyContext = null;
function setDestroyContext(stack) {
  exports.destroyContext = stack;
}

exports.mountContext = null;
function setMountContext(stack) {
  exports.mountContext = stack;
}

let effectContext = null;
function setEffectContext(newEffectContext) {
  effectContext = newEffectContext;
}

function initializeLifecycleContext(context) {
  setMountContext(context.mount);
  setEffectContext(context.effect);
  setDestroyContext(context.destroy);
}

let activeEffect = null;
function setActiveEffect(newActiveEffect) {
  activeEffect = newActiveEffect;
}
function effect(fn) {
  const wrappedEffect = () => {
    removeEffect(wrappedEffect);
    const previousEffect = activeEffect;
    activeEffect = wrappedEffect;
    if (effectContext) {
      effectContext.push(wrappedEffect);
    }
    try {
      fn();
    } finally {
      activeEffect = previousEffect;
    }
  };
  wrappedEffect.deps = [];
  wrappedEffect();
  return () => removeEffect(wrappedEffect);
}
function removeEffect(effect2) {
  if (effect2.deps) {
    for (const depSet of effect2.deps) {
      depSet.delete(effect2);
    }
    effect2.deps.length = 0;
  }
}

const targetToPropertyEffectsMap = /* @__PURE__ */ new WeakMap();
function track(target, key) {
  if (!activeEffect) return;
  let propertyEffectsMap = targetToPropertyEffectsMap.get(target);
  if (!propertyEffectsMap) {
    propertyEffectsMap = /* @__PURE__ */ new Map();
    targetToPropertyEffectsMap.set(target, propertyEffectsMap);
  }
  let effects = propertyEffectsMap.get(key);
  if (!effects) {
    effects = /* @__PURE__ */ new Set();
    propertyEffectsMap.set(key, effects);
  }
  if (!effects.has(activeEffect)) {
    effects.add(activeEffect);
    if (activeEffect.deps) {
      activeEffect.deps.push(effects);
    } else {
      activeEffect.deps = [effects];
    }
  }
}
function trigger(target, key) {
  const propertyEffectsMap = targetToPropertyEffectsMap.get(target);
  if (!propertyEffectsMap) return;
  const effects = propertyEffectsMap.get(key);
  if (!effects) return;
  const effectsToRun = new Set(effects);
  for (const effect of effectsToRun) {
    effect();
  }
}

function state(initialValue) {
  const state2 = { value: initialValue };
  return new Proxy(state2, {
    get(target, key, receiver) {
      track(target, key);
      return Reflect.get(target, key, receiver);
    },
    set(target, key, newValue, receiver) {
      const oldValue = target[key];
      const result = Reflect.set(target, key, newValue, receiver);
      if (oldValue !== newValue) {
        trigger(target, key);
      }
      return result;
    }
  });
}

function untrack(fn) {
  const prevEffect = activeEffect;
  setActiveEffect(null);
  try {
    return fn();
  } finally {
    setActiveEffect(prevEffect);
  }
}

const cleanupMap = /* @__PURE__ */ new Map();
function registerComponentCleanup(node, cleanups) {
  cleanupMap.set(node, cleanups);
}
function runComponentCleanup($node) {
  const cleanups = cleanupMap.get($node) || [];
  for (const cleanup of cleanups) {
    cleanup();
  }
}

function suspenseReactor(fn) {
  let cleanup = null;
  const run = () => {
    if (cleanup) cleanup();
    cleanup = effect(() => {
      try {
        fn();
      } catch (e) {
        if (e instanceof Promise) {
          e.then(run).catch(console.error);
        } else {
          console.error(e);
        }
      }
    });
  };
  run();
}

function patch($parent, $oldNodes, $newNodes, isFirstRender) {
  const maxLength = Math.max($oldNodes.length, $newNodes.length);
  for (let i = 0; i < maxLength; i++) {
    const $oldNode = $oldNodes[i];
    const $newNode = $newNodes[i];
    if (isFirstRender) {
      if (isNil($newNode)) continue;
      $parent.appendChild($newNode);
      $oldNodes[i] = $newNode;
      continue;
    }
    if (isNil($oldNode) && !isNil($newNode)) {
      $parent.appendChild($newNode);
      $oldNodes[i] = $newNode;
      continue;
    }
    if (!isNil($oldNode) && isNil($newNode)) {
      runComponentCleanup($oldNode);
      $parent.removeChild($oldNodes[i]);
      $oldNodes.splice(i, 1);
      i--;
      continue;
    }
    if (isNil($oldNode) && isNil($newNode)) {
      continue;
    }
    if ($oldNode && $newNode) {
      if (!$oldNode.isSameNode($newNode)) {
        runComponentCleanup($oldNode);
        $oldNode.replaceWith($newNode);
        $oldNodes[i] = $newNode;
      }
      continue;
    }
    console.log(`[veltra]: warning - unknown dom detected: `, {
      old: $oldNode,
      new: $newNode
    });
  }
  return [...$oldNodes];
}

function renderChildren($parent, children, index) {
  for (const $child of children) {
    if (typeof $child === "function") {
      let $oldNodes = [];
      let isFirstRender = true;
      suspenseReactor(() => {
        const $newNodes = toArray($child()).map(getNode).flat();
        $oldNodes = patch($parent, $oldNodes, $newNodes, isFirstRender);
        isFirstRender = false;
      });
    } else {
      const $node = getNode($child);
      if (!Array.isArray($node) && $node) {
        {
          $parent.appendChild($node);
        }
      }
    }
  }
}

const SVG_TAGS = /* @__PURE__ */ new Set([
  "a",
  "animate",
  "animateMotion",
  "animateTransform",
  "circle",
  "clipPath",
  "defs",
  "desc",
  "discard",
  "ellipse",
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feDistantLight",
  "feDropShadow",
  "feFlood",
  "feFuncA",
  "feFuncB",
  "feFuncG",
  "feFuncR",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMergeNode",
  "feMorphology",
  "feOffset",
  "fePointLight",
  "feSpecularLighting",
  "feSpotLight",
  "feTile",
  "feTurbulence",
  "filter",
  "foreignObject",
  "g",
  "hatch",
  "hatchpath",
  "image",
  "line",
  "linearGradient",
  "marker",
  "mask",
  "mesh",
  "meshgradient",
  "meshpatch",
  "meshrow",
  "metadata",
  "mpath",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "radialGradient",
  "rect",
  "script",
  "set",
  "solidcolor",
  "stop",
  "style",
  "svg",
  "switch",
  "symbol",
  "text",
  "textPath",
  "title",
  "tref",
  "tspan",
  "unknown",
  "use",
  "view"
]);
const MATH_ML_TAGS = /* @__PURE__ */ new Set([
  "math",
  "maction",
  "maligngroup",
  "malignmark",
  "menclose",
  "merror",
  "mfenced",
  "mfrac",
  "mglyph",
  "mi",
  "mlabeledtr",
  "mmultiscripts",
  "mn",
  "mo",
  "mover",
  "mpadded",
  "mphantom",
  "mroot",
  "mrow",
  "ms",
  "mscarries",
  "mscarry",
  "msgroup",
  "mstack",
  "mstyle",
  "msub",
  "msubsup",
  "msup",
  "mtable",
  "mtd",
  "mtext",
  "mtr",
  "munder",
  "munderover",
  "semantics",
  "annotation",
  "annotation-xml"
]);

const UNIT_LESS_PROPS = [
  "animationIterationCount",
  "borderImageOutset",
  "borderImageSlice",
  "borderImageWidth",
  "boxFlex",
  "boxFlexGroup",
  "boxOrdinalGroup",
  "columnCount",
  "flex",
  "flexGrow",
  "flexPositive",
  "flexShrink",
  "flexNegative",
  "flexOrder",
  "gridRow",
  "gridColumn",
  "fontWeight",
  "lineClamp",
  "lineHeight",
  "opacity",
  "order",
  "orphans",
  "tabSize",
  "widows",
  "zIndex",
  "zoom",
  "fillOpacity",
  "floodOpacity",
  "stopOpacity",
  "strokeDasharray",
  "strokeDashoffset",
  "strokeMiterlimit",
  "strokeOpacity",
  "strokeWidth"
];

const IS_SSR = typeof document === "undefined";

function applyProps($element, props) {
  for (const key in props) {
    if (key.startsWith("on") && typeof props[key] === "function") {
      const type = key.slice(2).toLowerCase();
      let cleanup;
      effect(() => {
        if (cleanup) cleanup();
        const fn = props[key]();
        if (typeof fn === "function") {
          $element.addEventListener(type, fn);
          cleanup = () => $element.removeEventListener(type, fn);
        }
      });
    } else {
      effect(() => {
        const value = typeof props[key] === "function" ? props[key]() : props[key];
        if (key === "ref" && typeof value === "function") {
          value($element);
        } else if (key === "style") {
          applyStyle($element, value);
        } else if (key === "disabled") {
          $element.toggleAttribute(key, value);
        } else {
          $element.setAttribute(key, value);
        }
      });
    }
  }
}
function applyStyle($element, style) {
  for (const [key, value] of Object.entries(style)) {
    if (typeof value === "number" && !isUnitLessCSSProperty(key)) {
      $element.style[key] = `${value}px`;
    } else {
      $element.style[key] = value;
    }
  }
}
function isUnitLessCSSProperty(prop) {
  const unitLessProps = new Set(UNIT_LESS_PROPS);
  return unitLessProps.has(prop);
}

const suspensePromise = state(null);
function Suspense(props) {
  let $rootNode = document.createTextNode("");
  let $parent;
  const {
    fallback: _fallback,
    children: [children]
  } = props;
  const fallback = _fallback();
  let isFirstRender = true;
  let $oldNodes = [];
  const renderFallback = () => {
    $oldNodes = patch($parent, $oldNodes, getNodes(fallback), isFirstRender);
    isFirstRender = false;
  };
  const renderSuspenseChildren = () => {
    const $newNodes = getNodes(children()).flat();
    $oldNodes = patch($parent, $oldNodes, $newNodes, isFirstRender);
  };
  queueMicrotask(() => {
    $parent = $rootNode.parentNode;
    effect(() => {
      try {
        if (!$parent) return;
        renderFallback();
        if (suspensePromise.value) throw suspensePromise.value;
        renderSuspenseChildren();
      } catch (errorOrPromise) {
        if (errorOrPromise instanceof Promise) {
          errorOrPromise.then(() => {
            suspensePromise.value = null;
            renderSuspenseChildren();
          }).catch(() => {
          });
        } else {
          throw errorOrPromise;
        }
      }
    });
  });
  return $rootNode;
}
const getNodes = (items) => {
  const results = [];
  const flatItems = toArray(items);
  for (const item of flatItems) {
    const node = getNode(item);
    if (Array.isArray(node)) {
      results.push(...node);
    } else {
      results.push(node);
    }
  }
  return results;
};

const IGNORE_COMPONENT = [Suspense];
function resolveComponentProps(type, props) {
  if (IGNORE_COMPONENT.includes(type)) return;
  for (const key in props) {
    props[key] = props[key] instanceof Function ? props[key]() : props[key];
  }
}

const componentRootNodes = /* @__PURE__ */ new Set();
function mountComponent(type, props, children) {
  resolveComponentProps(type, props);
  const lifecycleContext = {
    mount: [],
    effect: [],
    // reactor: [],
    destroy: []
  };
  initializeLifecycleContext(lifecycleContext);
  let $node = untrack(() => type({ ...props, children }));
  let $target = $node;
  if (Array.isArray($node)) {
    $target = document.createTextNode("");
    $node.unshift($target);
  }
  registerLifeCycles(lifecycleContext, $target);
  componentRootNodes.add($target);
  return $node;
}

const jsx = (type, { children = [], ...props }) => {
  if (IS_SSR) {
    return hSSR(type, props, toArray(children));
  }
  return h(type, props, toArray(children));
};
function Fragment({ children }) {
  return children;
}

function h(type, props, children) {
  if (type === Fragment) {
    return children;
  }
  if (typeof type === "function") {
    return mountComponent(type, props, children);
  }
  const $element = createElement(type, props.xmlns);
  applyProps($element, props);
  renderChildren($element, children);
  return $element;
}
function createElement(tag, namespace) {
  if ((SVG_TAGS.has(tag) || MATH_ML_TAGS.has(tag)) && namespace) {
    return document.createElementNS(namespace, tag);
  }
  return document.createElement(tag);
}

function hSSR(type, props, children) {
  if (typeof type === "function") {
    return type({ ...props, children });
  }
  return `<${type} ${handlePropsSSR(props)}>${handleChildrenSSR(
    children
  )}</${type}>`;
}
function handlePropsSSR(props) {
  const transformedProps = [];
  for (const key in props) {
    if (key.startsWith("on") && typeof props[key] === "function") {
      continue;
    }
    const value = typeof props[key] === "function" ? props[key]() : props[key];
    if (key === "ref" && typeof value === "function") ; else if (key === "style") ; else if (key === "disabled") {
      value && transformedProps.push("disabled");
    } else {
      transformedProps.push(`${key}="${value}"`);
    }
  }
  return transformedProps.join(" ");
}
function handleChildrenSSR(children) {
  let transformedChildren = [];
  for (const child of children) {
    if (typeof child === "function") {
      transformedChildren.push(String(child()));
    } else if (Array.isArray(child)) {
      child.forEach(
        (nested) => transformedChildren.push(handleChildrenSSR([nested]))
      );
    } else {
      transformedChildren.push(child);
    }
  }
  return transformedChildren.join("");
}

const isNil = (value) => {
  return value === void 0 || value === null || value === false;
};

function getNode(jsxElement) {
  if (jsxElement instanceof Node) {
    return jsxElement;
  }
  if (isNil(jsxElement)) {
    return void 0;
  }
  if (typeof jsxElement === "function") {
    return getNode(jsxElement());
  }
  if (Array.isArray(jsxElement)) {
    return jsxElement.map(getNode);
  }
  return document.createTextNode(String(jsxElement));
}

const toArray = (item) => {
  return (Array.isArray(item) ? item : [item]).flat(Infinity);
};

function onNodeReattached(callback, $node) {
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      for (const node of mutation.addedNodes) {
        if (node === $node) {
          observer.disconnect();
          callback();
          break;
        }
      }
    }
  });
  queueMicrotask(() => {
    if (!$node.parentNode) {
      return;
    }
    observer.observe($node.parentNode, { childList: true, subtree: true });
  });
}

function registerLifeCycles(context, $target) {
  const cleanups = [];
  setMountContext(null);
  setEffectContext(null);
  setDestroyContext(null);
  registerComponentCleanup($target, cleanups);
  queueMicrotask(() => {
    cleanups.push(
      ...context.destroy,
      ...context.mount.map((fn) => fn()).filter((c) => !!c),
      ...context.effect.map((fn) => () => removeEffect(fn))
      // ...context.reactor.map((fn) => () => removeReactor(fn))
    );
  });
  onNodeReattached(() => {
    cleanups.push(...context.mount.map((fn) => fn()).filter((c) => !!c));
  }, $target);
}

exports.Fragment = Fragment;
exports.Suspense = Suspense;
exports.componentRootNodes = componentRootNodes;
exports.effect = effect;
exports.jsx = jsx;
exports.renderChildren = renderChildren;
exports.runComponentCleanup = runComponentCleanup;
exports.state = state;
exports.suspensePromise = suspensePromise;
exports.toArray = toArray;
exports.track = track;
exports.trigger = trigger;
exports.untrack = untrack;
//# sourceMappingURL=register-lifecycle-CEfyV6MR.js.map
