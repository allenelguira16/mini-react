import { effect, state } from "../mini-app";
import { name, setName } from "./globalState";

export const Forms = () => {
  return (
    <div>
      <div>Hi {name()}</div>
      <div>
        <input type="text" />
      </div>
      <div>
        <Counter />
        <Input />
      </div>
    </div>
  );
};

function Counter() {
  const [count, setCount] = state(1);

  effect(() => {
    console.log(count());
  });

  const handleCount = () => {
    setCount(count() + 1);
  };

  return (
    <div>
      <div>Count: {count()}</div>
      <button disabled={count() > 5} onClick={handleCount}>
        Add counter
      </button>
      {count() >= 10 && <div>Hi</div>}
    </div>
  );
}

function Input() {
  return (
    <div>
      <div>Name {name()}</div>
      <input
        type="text"
        onInput={(event: KeyboardEvent) => {
          const input = event.currentTarget as HTMLInputElement;
          setName(input.value);
        }}
        value={name()}
      />
    </div>
  );
}
