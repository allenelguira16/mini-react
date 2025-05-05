import { App } from "./App";
import { createApp } from "./Nebula/compiler";

createApp(document.querySelector<HTMLElement>("#app")!, <App />);
