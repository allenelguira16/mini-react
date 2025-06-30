import * as _veltra_app from '@veltra/app';

type Route = {
    path: string;
    component: () => JSX.Element;
    children?: Route[];
    guard?: () => boolean;
    lazy?: () => Promise<{
        default: () => JSX.Element;
    }>;
};
type Location = {
    pathname: string;
    search: string;
};
declare const location: _veltra_app.State<Location>;
/**
 * navigate to a path
 *
 * @param path - The path to navigate to.
 */
declare function navigate(path: string): void;
/**
 * create a router
 *
 * @param props - The properties of the router.
 * @returns The router.
 */
declare function Router(props: {
    routes: Route[];
}): () => JSX.Element;

export { Router, location, navigate };
export type { Location, Route };
