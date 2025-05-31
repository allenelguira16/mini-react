import { effect, state, For } from "../mini-app";
import { name } from "./globalState";

type SortDirection = "asc" | "desc";

export const DropdownList = () => {
  const dir = state<SortDirection>("asc");
  const numbers = state([1, 2, 3, 4, 5, 6, 7, 8]);

  const handleSort = () => {
    numbers.value = numbers.value.sort((a, b) => {
      return dir.value === "desc" ? a - b : b - a;
    });
    dir.value = dir.value === "asc" ? "desc" : "asc";
  };

  const handleRandomize = () => {
    const result = numbers.value;
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }

    numbers.value = result;
  };

  const addDropdown = () => {
    if (numbers.value.length >= 8) return;

    if (!numbers.value.length) {
      numbers.value = [1];
    } else {
      numbers.value = [...numbers.value, numbers.value.length + 1];
    }
  };

  const removeDropdown = () => {
    if (numbers.value.length > 0) {
      numbers.value = numbers.value.slice(0, -1);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div>
        <div>
          <span style={{ marginRight: "10px" }}>Add Dropdown</span>
          <button onClick={addDropdown}>Add</button>
          <button onClick={removeDropdown}>Remove</button>
        </div>
      </div>
      <div>
        <span style={{ marginRight: "10px" }}>Sort</span>
        <button onClick={handleSort} style={{ width: "90px" }}>
          {dir.value === "asc" ? "Descending" : "Ascending"}
        </button>
        <button onClick={handleRandomize}>Randomize</button>
      </div>
      <div style={{ display: "flex" }}>
        {/* {numbers.value.map((number) => (
          <Dropdown number={number} />
        ))} */}
        <For items={numbers.value} fallback={<div>hi</div>}>
          {(number) => <Dropdown number={number} />}
        </For>
      </div>
    </div>
  );
};

const Dropdown = ({ number }: { number: number }) => {
  let divElement!: HTMLElement;
  const isOpen = state(false);

  const handleToggle = () => {
    isOpen.value = !isOpen.value;
    console.log(divElement);
  };

  effect(() => {
    isOpen.value;

    return () => {
      console.log("hi");
    };
  });

  return (
    <div ref={divElement} style={{ position: "relative" }}>
      <div>
        <button onClick={handleToggle}>Open Dropdown {number}</button>
        <div style={{ wordBreak: "break-word" }}>Hi {name.value}</div>
      </div>
      {isOpen.value && (
        <div style={{ position: "absolute" }}>
          <ul>
            <li>Dropdown 1</li>
            <li>Dropdown 2</li>
            <li>Dropdown 3</li>
          </ul>
        </div>
      )}
    </div>
  );
};
