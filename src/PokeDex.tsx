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
    console.log("called");

    if (!url) return;

    isLoading.value = true;

    const response = await fetch(url);
    const json = (await response.json()) as PokeDexData;

    console.log(json);
    pokeDexList.value = json.results;
    prevLink.value = json.previous?.replace(/limit=\d+/, "limit=20") ?? "";
    nextLink.value = json.next?.replace(/limit=\d+/, "limit=20") ?? "";
    isLoading.value = false;
  };

  effect(async () => {
    // await fetchPokeDexData("https://pokeapi.co/api/v2/pokemon/")();
    await fetchPokeDexData(
      "https://pokeapi.co/api/v2/pokemon/?offset=1100&limit=20"
    )();
  });

  const handleSort = (key: SortKey, dir: SortDirection) => () => {
    currentDirection.value = dir === "asc" ? "desc" : "asc";
    pokeDexList.value = pokeDexList.value.sort((a, b) => {
      const cmp = a[key].localeCompare(b[key]);
      return currentDirection.value === "asc" ? cmp : -cmp;
    });
  };

  effect(() => {
    // console.log(pokeDexList.value);
  });

  return (
    <div>
      <div>Hi {name.value}</div>
      {isLoading.value && <div>loading</div>}
      {!isLoading.value && (
        <>
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
              <For items={pokeDexList.value} key={({ name }) => name}>
                {({ name, url }) => (
                  <tr>
                    <td>{name}</td>
                    <td onClick={() => alert(url)}>{url}</td>
                  </tr>
                )}
              </For>
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
        </>
      )}
    </div>
  );
};
