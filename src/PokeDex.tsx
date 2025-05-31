import { effect, state, For } from "../mini-app";
import { name } from "./globalState";

type PokeDexData = {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
};

type SortKey = keyof PokeDexData["results"][number];
type SortDirection = "asc" | "desc";

export const PokeDex = () => {
  const isLoading = state(false);
  const pokeDexList = state<PokeDexData["results"]>([]);
  const prevLink = state<PokeDexData["previous"]>("");
  const nextLink = state<PokeDexData["next"]>("");
  const currentDirection = state<SortDirection>("asc");

  const fetchPokeDexData = (url: string | null) => async () => {
    if (!url) return;

    isLoading.value = true;

    const response = await fetch(url);
    const json = (await response.json()) as PokeDexData;

    setTimeout(() => {
      pokeDexList.value = json.results;
      prevLink.value = json.previous?.replace(/limit=\d+/, "limit=20") ?? "";
      nextLink.value = json.next?.replace(/limit=\d+/, "limit=20") ?? "";
      isLoading.value = false;
    }, 1000);
  };

  effect(async () => {
    // await fetchPokeDexData("https://pokeapi.co/api/v2/pokemon/")();
    await fetchPokeDexData(
      "https://pokeapi.co/api/v2/pokemon/?offset=1100&limit=20"
    )();
  });

  effect(() => {
    // console.log(
    //   !isLoading.value && (
    //     <div>
    //       <For items={pokeDexList.value} key={({ name }) => name}>
    //         {({ name, url }) => (
    //           <tr>
    //             <td>{name}</td>
    //             <td onClick={() => alert(url)}>{url}</td>
    //           </tr>
    //         )}
    //       </For>
    //     </div>
    //   )
    // );
    // console.log(pokeDexList.value);
  });

  const handleSort = (key: SortKey, dir: SortDirection) => () => {
    currentDirection.value = dir === "asc" ? "desc" : "asc";
    pokeDexList.value = pokeDexList.value.sort((a, b) => {
      const cmp = a[key].localeCompare(b[key]);
      return currentDirection.value === "asc" ? cmp : -cmp;
    });
  };

  console.log("rerender");

  return (
    <div>
      <div style={{ wordBreak: "break-word" }}>Hi {name.value}</div>
      <table>
        <thead>
          <tr>
            <th
              onClick={handleSort("name", currentDirection.value)}
              style={{ userSelect: "none", cursor: "pointer" }}
            >
              Name
            </th>
            <th
              onClick={handleSort("url", currentDirection.value)}
              style={{ userSelect: "none", cursor: "pointer" }}
            >
              URL
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading.value && (
            <tr>
              <td rowspan="20" colspan="2">
                Loading
              </td>
            </tr>
          )}
          {/* {!isLoading.value &&
            pokeDexList.value.map(({ name, url }) => (
              <tr>
                <td>{name}</td>
                <td onClick={() => alert(url)}>{url}</td>
              </tr>
            ))} */}
          {!isLoading.value && (
            <For items={pokeDexList.value} key={({ name }) => name}>
              {({ name, url }) => (
                <tr>
                  <td>{name}</td>
                  <td onClick={() => alert(url)}>{url}</td>
                </tr>
              )}
            </For>
          )}
        </tbody>
      </table>
      <div>
        <button
          onClick={fetchPokeDexData(prevLink.value)}
          disabled={isLoading.value || !prevLink.value}
        >
          Previous
        </button>
        <button
          onClick={fetchPokeDexData(nextLink.value)}
          disabled={isLoading.value || !nextLink.value}
        >
          Next
        </button>
      </div>
    </div>
  );
};
