import { useState } from "../mini-app";

export const DropdownList = () => {
  const [numbers, setNumbers] = useState([1, 2, 3]);

  const addDropdown = () => {
    setNumbers([...numbers(), numbers()[numbers.length - 1] + 1]);
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
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen());
  };

  return (
    <div style={{ position: "relative" }}>
      <button onClick={handleToggle}>Open Dropdown {number}</button>
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
