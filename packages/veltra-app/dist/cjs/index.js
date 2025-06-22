'use strict';

var jsxRuntime = require('./chunks/register-lifecycle-CEfyV6MR.js');

function onMount(fn) {
  if (jsxRuntime.mountContext) {
    jsxRuntime.mountContext.push(fn);
  } else {
    throw new Error("onMount called outside of component");
  }
}

function onDestroy(fn) {
  if (jsxRuntime.destroyContext) {
    jsxRuntime.destroyContext.push(fn);
  } else {
    throw new Error("onDestroy called outside of component");
  }
}

const proxyMap = /* @__PURE__ */ new WeakMap();
function store(initialObject) {
  function createReactiveObject(obj) {
    if (proxyMap.has(obj)) return proxyMap.get(obj);
    const proxy = new Proxy(obj, {
      get(target, key, receiver) {
        jsxRuntime.track(target, key);
        const result = Reflect.get(target, key, receiver);
        if (typeof result === "function") {
          return result.bind(receiver);
        }
        const descriptor = Reflect.getOwnPropertyDescriptor(target, key);
        if (descriptor?.get) {
          return descriptor.get.call(receiver);
        }
        if (typeof result === "object" && result !== null && !(result instanceof Node)) {
          return createReactiveObject(result);
        }
        return result;
      },
      set(target, key, value, receiver) {
        const oldValue = target[key];
        const result = Reflect.set(target, key, value, receiver);
        if (oldValue !== value) {
          jsxRuntime.trigger(target, key);
        }
        return result;
      }
    });
    proxyMap.set(obj, proxy);
    return proxy;
  }
  return createReactiveObject(initialObject);
}

function computed(getter) {
  const result = jsxRuntime.state();
  jsxRuntime.effect(() => {
    result.value = getter();
  });
  return {
    get value() {
      return result.value;
    }
  };
}

function resource(fetcher) {
  const data = store({
    loading: true,
    error: null,
    data: void 0
  });
  let realPromise = null;
  const refetch = () => {
    data.loading = true;
    realPromise = new Promise((resolve, reject) => {
      fetcher().then((result) => {
        data.data = result;
        data.loading = false;
        data.error = null;
        resolve();
      }).catch((err) => {
        data.error = err;
        data.loading = false;
        reject(err);
      });
    });
    return realPromise;
  };
  jsxRuntime.effect(() => {
    refetch();
  });
  return {
    get loading() {
      return data.loading;
    },
    get error() {
      return data.error;
    },
    get data() {
      if (data.loading) throw realPromise;
      if (!data.loading && data.error) throw data.error;
      return data.data;
    },
    refetch,
    mutate(newValue) {
      data.data = newValue;
    }
  };
}

function memo(fn) {
  let cachedResult;
  let firstRun = true;
  return () => {
    if (firstRun) {
      cachedResult = fn();
      firstRun = false;
    }
    return cachedResult;
  };
}

function unwrap(value) {
  function deepUnwrap(obj) {
    if (obj === null || typeof obj !== "object") return obj;
    if (typeof obj === "function") return obj;
    const result = {};
    for (const key of Reflect.ownKeys(obj)) {
      const value2 = obj[key];
      result[key] = deepUnwrap(value2);
    }
    return result;
  }
  return deepUnwrap(value);
}

function removeEntryNodes($parent, entry) {
  for (const node of entry.nodes) {
    if ($parent.contains(node)) {
      jsxRuntime.runComponentCleanup(node);
      $parent.removeChild(node);
    }
  }
}
function insertNodes($parent, nodes, referenceNode) {
  for (const node of nodes) {
    $parent.insertBefore(node, referenceNode);
  }
}
function reorderEntries($rootNode, $parent, entries, items) {
  const placeCounts = /* @__PURE__ */ new Map();
  let ref = $rootNode.nextSibling;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    placeCounts.set(item, (placeCounts.get(item) || 0) + 1);
    let count = 0;
    const entry = entries.find(
      (e) => e.item === item && ++count === placeCounts.get(item)
    );
    if (!entry) continue;
    jsxRuntime.untrack(() => entry.index.value = i);
    insertNodes($parent, entry.nodes, ref);
    ref = entry.nodes[entry.nodes.length - 1].nextSibling;
  }
}
function countOccurrences(list) {
  const counts = /* @__PURE__ */ new Map();
  for (const item of list) counts.set(item, (counts.get(item) || 0) + 1);
  return counts;
}
function removeOldNodes($parent, items, entries) {
  const newCounts = countOccurrences(items);
  const oldCounts = countOccurrences(entries.map((e) => e.item));
  return entries.filter((entry) => {
    if ((oldCounts.get(entry.item) ?? 0) > (newCounts.get(entry.item) ?? 0)) {
      removeEntryNodes($parent, entry);
      oldCounts.set(entry.item, (oldCounts.get(entry.item) ?? 0) - 1);
      return false;
    }
    return true;
  });
}
function newEntries(items, entries, children, idCounter) {
  const addedEntries = [];
  const seenCounts = /* @__PURE__ */ new Map();
  for (const item of items) {
    seenCounts.set(item, (seenCounts.get(item) || 0) + 1);
    const exists = entries.filter((e) => e.item === item).length + addedEntries.filter((e) => e.item === item).length;
    if (exists < (seenCounts.get(item) || 0)) {
      const indexState = jsxRuntime.state(-1);
      const nodes = jsxRuntime.toArray(children(item, indexState));
      addedEntries.push({
        id: idCounter++,
        item,
        nodes,
        index: indexState
      });
    }
  }
  return addedEntries;
}

function loop(items) {
  return {
    each: (children) => {
      return jsxRuntime.jsx((props) => {
        const {
          items: each,
          children: [children2]
        } = props;
        const $rootNode = document.createTextNode("");
        let entries = [];
        let idCounter = 0;
        function reconcile($parent, items2) {
          entries = removeOldNodes($parent, items2, entries);
          entries.push(...newEntries(items2, entries, children2, idCounter));
          reorderEntries($rootNode, $parent, entries, items2);
        }
        onMount(() => {
          jsxRuntime.effect(() => {
            const $parent = $rootNode.parentNode;
            if (!$parent) return;
            try {
              const list = each();
              if (!list) return;
              reconcile($parent, [...list]);
            } catch (errorOrPromise) {
              if (errorOrPromise instanceof Promise) {
                jsxRuntime.suspensePromise.value = errorOrPromise;
              } else {
                throw errorOrPromise;
              }
            }
          });
        });
        onDestroy(() => {
          for (const entry of entries) {
            removeEntryNodes($rootNode.parentNode, entry);
          }
        });
        jsxRuntime.componentRootNodes.add($rootNode);
        return $rootNode;
      }, {
        items: () => items,
        children
      });
    }
  };
}

function createRoot($root, App) {
  jsxRuntime.renderChildren($root, jsxRuntime.toArray(App()));
}

function logJsx($nodes) {
  const $newNodes = [
    ...$nodes.filter(
      ($node) => !($node instanceof Text && jsxRuntime.componentRootNodes.has($node))
    )
  ];
  return $newNodes.length === 1 ? $newNodes[0] : $newNodes;
}

exports.Suspense = jsxRuntime.Suspense;
exports.effect = jsxRuntime.effect;
exports.state = jsxRuntime.state;
exports.untrack = jsxRuntime.untrack;
exports.computed = computed;
exports.createRoot = createRoot;
exports.logJsx = logJsx;
exports.loop = loop;
exports.memo = memo;
exports.onDestroy = onDestroy;
exports.onMount = onMount;
exports.resource = resource;
exports.store = store;
exports.unwrap = unwrap;
//# sourceMappingURL=index.js.map
