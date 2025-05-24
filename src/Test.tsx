import { useEffect, useState } from "../mini-app";

export const Test = () => {
  return (
    <div>
      <div>
        <input type="text" />
      </div>
      <div>
        <Counter />
        <Input />
      </div>
      <>Hi Allen</>
    </div>
  );
};

function Counter() {
  const [count, setCount] = useState(1);

  useEffect(() => {
    console.log(count());
  });

  const handleCount = () => {
    setCount(count() + 1);
  };

  return (
    <div>
      <div>Hi {count()}</div>
      <button disabled={count() > 5} onClick={handleCount}>
        Add counter
      </button>
      {count() >= 10 && <div>Hi</div>}
    </div>
  );
}

function Input() {
  const [name, setName] = useState("a");

  return (
    <div>
      <div>Hi {name()}</div>
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
