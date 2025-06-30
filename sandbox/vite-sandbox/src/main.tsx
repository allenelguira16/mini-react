import "./main.css";

import { createRoot } from "@veltra/app";

import { App } from "./App";
createRoot(document.getElementById("app")!, () => <App />);
// import { effect, resource, state } from "@veltra/app";

// const count = state(0);

// const msg = resource(async () => {
//   const value = count.value;
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(`render ${value}`);
//     }, 1000);
//   });
// });

// setInterval(() => {
//   count.value++;
// }, 1000);

// let disposer: (() => void) | undefined;

// const run = () => {
//   // disposer?.();

//   // disposer =
//   const disposer = effect(() => {
//     try {
//       console.log(msg.data);
//     } catch (error) {
//       // stopEffect();
//       if (error instanceof Promise) {
//         queueMicrotask(() => {
//           disposer();
//         });
//         error.then(() => {
//           run();
//         });
//       }
//     }
//   });
//   // stopEffect();
// };

// run();
