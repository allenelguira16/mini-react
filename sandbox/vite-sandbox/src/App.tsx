import { Dropdowns } from "./components/DropdownList";
import { PokeDex } from "./components/PokeDex";
import { Forms } from "./components/Forms";
import { PokeDexSuspense } from "./components/PokeDexSuspense";

export const App = () => {
  return (
    <>
      <div class="p-2 flex flex-col container m-auto">
        <div class="p-2 w-full">
          <h1 class="font-bold text-2xl">PokeDex Suspense</h1>
          <PokeDexSuspense />
        </div>
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
