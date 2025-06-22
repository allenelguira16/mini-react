import "./main.css";

import { createRoot } from "@veltra/app";

import { App } from "./App";

createRoot(document.getElementById("app")!, () => <App />);
