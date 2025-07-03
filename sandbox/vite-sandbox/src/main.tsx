import "./main.css";

import { createApp, effect, resource, stopEffect } from "@veltra/app";

import { App } from "./App";

const app = createApp(App);

app.mount("#app");

// const count = state(0);

const msg = resource(async () => {
  await new Promise((resolve) => {
    setTimeout(resolve, 1000); // delay for 1 second
  });
  return "hello world";
});

effect(() => {
  try {
    console.log(msg.data);
  } catch (error) {
    stopEffect();
    if (error instanceof Promise) {
      error.then(() => {
        console.log(msg.data);
      });
    }
  }
});
