import { Dropdowns } from "./components/DropdownList";
import { PokeDex } from "./components/PokeDex";
import { Forms } from "./components/Forms";
// import { onMount } from "@veltra/app";

export const App = () => {
  // let element!: HTMLElement;
  // When state is updating in the child component, it won't rerender all components, it will just rerender the current component

  // onMount(() => {
  //   console.log("App should not rerender");
  //   console.log(element);
  // });

  return (
    <>
      <div class="p-2 flex flex-col container m-auto">
        <div class="p-2 w-full">
          <h1 class="font-bold text-2xl">PokeDex</h1>
          <PokeDex />
        </div>
        <div class="p-2 w-full">
          <h1 class="font-bold text-2xl">Dropdown List</h1>
          <Dropdowns />
        </div>
        <div class="p-2 w-full">
          <h1 class="font-bold text-2xl">Forms</h1>
          <Forms />
        </div>
      </div>
    </>
  );
};

// console.log(<App />);
