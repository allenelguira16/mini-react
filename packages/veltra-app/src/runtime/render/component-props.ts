export function resolveComponentProps(props: Record<string, any>) {
  for (const key in props) {
    props[key] = props[key] instanceof Function ? props[key]() : props[key];
  }
}
