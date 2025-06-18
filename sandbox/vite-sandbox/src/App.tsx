import { Dropdowns } from "./components/DropdownList";
import { PokeDex } from "./components/PokeDex";
import { Forms } from "./components/Forms";
import { effect, memo, onMount, state, Suspense, loop } from "@veltra/app";
// import { onMount } from "@veltra/app";

// const count = state(0);

// effect(() => {
//   effect(() => {
//     // console.log(count.value)
//     console.log(count.value);
//   });
//   // count.value++;
// });

// setInterval(() => {
//   count.value++;
// }, 500);

export function resource<T>(fetcher: () => Promise<T>) {
  const loading = state(true);
  const error = state<any>(null);
  let value: T | undefined;
  let promise: Promise<void> | undefined;

  const load = fetcher()
    .then((result) => {
      value = result;
      loading.value = false;
    })
    .catch((err) => {
      error.value = err;
      loading.value = false;
    });

  promise = load;

  return {
    get value() {
      if (loading.value) throw promise;
      if (error.value) throw error.value;
      return value!;
    },
    loading,
    error,
  };
}

type PokeDexData = {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
};

const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export const App = () => {
  // const count = state(0);

  // onMount(() => {
  // });
  // setInterval(() => {
  //   count.value++;
  //   // console.log("hi");
  // }, 1000);

  return (
    <>
      <div class="p-2 flex flex-col container m-auto">
        {/* {[1, 2, 3].map((number) => (
          <div>{number}</div>
        ))} */}
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

console.log(<App />);
