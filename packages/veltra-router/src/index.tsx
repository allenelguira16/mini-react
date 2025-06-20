import { state, effect } from "@veltra/app";

export type Route = {
  path: string;
  component: () => JSX.Element;
  children?: Route[];
  guard?: () => boolean;
  lazy?: () => Promise<{ default: () => JSX.Element }>;
};

export type Location = {
  pathname: string;
  search: string;
};

export const location = state<Location>({
  pathname: window.location.pathname,
  search: window.location.search,
});

window.addEventListener("popstate", () => {
  location.value = {
    ...location.value,
    pathname: window.location.pathname,
  };
});

export function navigate(path: string) {
  history.pushState(null, "", path);
  location.value = {
    ...location.value,
    pathname: path,
  };
}

function matchRoute(path: string, routes: Route[]): Route | undefined {
  for (const route of routes) {
    if (route.path === path) return route;
    if (route.children) {
      const child = matchRoute(path, route.children);
      if (child) return child;
    }
  }
  return undefined;
}

export function Router(props: { routes: Route[] }) {
  const current = state<() => JSX.Element>(() => <></>);

  effect(() => {
    const matched = matchRoute(location.value.pathname, props.routes);
    if (matched) {
      if (matched.guard && !matched.guard()) {
        current.value = () => <div>Access Denied</div>;
        return;
      }
      if (matched.lazy) {
        matched.lazy().then((mod) => {
          current.value = mod.default;
        });
        return;
      }
      current.value = matched.component;
    } else {
      current.value = () => <div>404 Not Found</div>;
    }
  });

  return () => {
    return <>{current.value()}</>;
  };
}
