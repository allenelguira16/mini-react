import { MouseEventHandler } from "react";
// import { createEffect, createSignal } from "./Nebula/signal";
import { effect, state } from "./Nebula";

function Hello(props: { name: string }) {
  return <div>Hello {props.name}</div>;
}

export const App = () => {
  const [count, setCount] = state(0);

  effect(() => {
    console.log(count);
  });

  const handleCount: MouseEventHandler<HTMLButtonElement> = () => {
    setCount(count + 1);
  };

  console.log(count);

  return (
    <div>
      <input type="text">Hi</input>
      <button onClick={handleCount}>test {count} Hi</button>
      <button className="hello" onClick={handleCount}>
        click me!
      </button>
      <div>Hi {count}</div>
    </div>
  );
};
