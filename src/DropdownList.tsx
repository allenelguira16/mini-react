import { state } from "../mini-app";
import { name } from "./globalState";

export const DropdownList = () => {
  const [numbers, setNumbers] = state([1, 2, 3]);

  const addDropdown = () => {
    setNumbers([...numbers(), numbers()[numbers().length - 1] + 1]);
  };

  return (
    <div>
      <div>
        <span>Add Dropdown</span>
        <button onClick={addDropdown}>Add</button>
      </div>
      <div style={{ display: "flex" }}>
        {numbers().map((number) => (
          <Dropdown number={number} />
        ))}
      </div>
    </div>
  );
};

const Dropdown = ({ number }: { number: number }) => {
  const [isOpen, setIsOpen] = state(false);

  const handleToggle = () => {
    setIsOpen(!isOpen());
  };

  return (
    <div style={{ position: "relative" }}>
      <div>
        <button onClick={handleToggle}>Open Dropdown {number}</button>
        <div>Hi {name()}</div>
      </div>
      {isOpen() && (
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
