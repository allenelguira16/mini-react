import { MouseEventHandler } from "react";
import { effect, state } from "../mini-react";

export const App = () => {
  const [name, setName] = state("");
  const [count, setCount] = state(0);

  effect(() => {
    console.log(count);
  }, [name]);

  const handleCount: MouseEventHandler<HTMLButtonElement> = () => {
    setCount(count + 1);
  };

  return (
    <div style={{ padding: 10 }}>
      <div>
        <input
          type="text"
          placeholder="Set your name"
          onInput={(event) => {
            setName(event.currentTarget.value);
          }}
          value={name}
        />
        <button onClick={handleCount}>Increase Counter</button>
      </div>
      <ChildApp name={name} count={count} />
    </div>
  );
};

const ChildApp = ({ name, count }: { name: string; count: number }) => {
  return (
    <div>
      <div>Hi my name is {name}</div>
      <div>Counter: {count}</div>
      {count > 10 && <div>Fuck you!</div>}
    </div>
  );
};
