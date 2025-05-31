import { DropdownList } from "./DropdownList";
import { PokeDex } from "./PokeDex";
import { Forms } from "./Forms";

export const App = () => {
  console.log("App should not rerender"); // When state is updating in the child component, it won't rerender all components, it will just rerender the current component

  return (
    <div
      style={{
        padding: 10,
        display: "flex",
        flexDirection: "column",
        maxWidth: "38%",
        margin: "auto",
      }}
    >
      {/* <div style={{ padding: 10, width: "100%" }}>
        <h1>PokeDex</h1>
        <PokeDex />
      </div> */}
      <div style={{ padding: 10, width: "100%" }}>
        <h1>Dropdown List</h1>
        <DropdownList />
      </div>
      <div style={{ padding: 10, width: "100%" }}>
        <h1>Forms</h1>
        <Forms />
      </div>
    </div>
  );
};
