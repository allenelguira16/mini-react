import { useEffect, useState } from "../mini-app";
import { DropdownList } from "./DropdownList";
import { PokeDex } from "./PokeDex";
import { Test } from "./Test";

export const App = () => {
  console.log("App Rerender"); // When state is updating in the child component, it won't rerender all components, it will just rerender the current component

  return (
    <div>
      <div style={{ padding: 10, margin: "auto" }}>
        <h1>PokeDex</h1>
        <PokeDex />
      </div>
      <div style={{ padding: 10, margin: "auto" }}>
        <h1>Dropdown List</h1>
        <DropdownList />
      </div>
      <div style={{ padding: 10, margin: "auto" }}>
        <h1>Forms</h1>
        <Test />
      </div>
    </div>
  );
};
