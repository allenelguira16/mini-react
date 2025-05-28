import { effect, state, For } from "../mini-app";
import { name } from "./globalState";

type SortDirection = "asc" | "desc";

export const DropdownList = () => {
  const currentDirection = state<SortDirection>("asc");
  const numbers = state([1, 2, 3]);

  const handleSort = (dir: SortDirection) => () => {
    currentDirection.value = dir === "asc" ? "desc" : "asc";

    numbers.value = numbers.value.sort((a, b) => {
      return currentDirection.value === "desc" ? a - b : b - a;
    });
  };

  const addDropdown = () => {
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
    <div>
      <div>
        <span>Add Dropdown</span>
        <button onClick={addDropdown}>Add</button>
        <button onClick={removeDropdown}>Remove</button>
      </div>
      <div>
        <span>Sort</span>
        <button onClick={handleSort("asc")}>Ascending</button>
        <button onClick={handleSort("desc")}>Descending</button>
      </div>
      <div style={{ display: "flex" }}>
        <For items={numbers.value} fallback={<div>hi</div>}>
          {(number) => <Dropdown number={number} />}
        </For>
      </div>
    </div>
  );
};

const Dropdown = ({ number }: { number: number }) => {
  const isOpen = state(false);

  const handleToggle = () => {
    isOpen.value = !isOpen.value;
  };

  effect(() => {
    // console.log(isOpen.value);

    return () => {
      // console.log("hi");
    };
  });

  return (
    <div style={{ position: "relative" }}>
      <div>
        <button onClick={handleToggle}>Open Dropdown {number}</button>
        <div>Hi {name.value}</div>
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
