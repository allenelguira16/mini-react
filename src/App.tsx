import { MouseEventHandler } from "react";
import { $effect, $state } from "../mini-react";

export const App = () => {
  console.log("App Rerender"); // When state is updating in the child component, it won't rerender all components, it will just rerender the current component

  return (
    <div style={{ padding: 10 }}>
      <h1>Test</h1>
      <Form />
    </div>
  );
};

const Form = () => {
  const [name, setName] = $state("");
  const [count, setCount] = $state(0);

  $effect(() => {
    console.log(count);
  }, [name]);

  $effect(async () => {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");
    const json = await response.json();

    console.log(json);
  }, []);

  const handleCount: MouseEventHandler<HTMLButtonElement> = () => {
    setCount(count + 1);
  };

  return (
    <div>
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
      <Display name={name} count={count} />
    </div>
  );
};

type DisplayProps = { name: string; count: number };

const Display = ({ name, count }: DisplayProps) => {
  return (
    <div>
      <div>Hi my name is {name}</div>
      <div>Counter: {count}</div>
      {count > 10 && <div>Fuck you!</div>}
    </div>
  );
};
