import { state, resource, Suspense } from "@veltra/app";

import { name } from "../globalState";
import { sleep } from "src/sleep";

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

export const PokeDexSuspense = () => {
  const url = state("https://pokeapi.co/api/v2/pokemon/?offset=1100&limit=20");

  const pokeDexList = resource(async () => {
    const response = await fetch(url.value);
    const json = (await response.json()) as PokeDexData;

    await sleep(500);

    return json;
  });

  const currentDirection = state<SortDirection>("asc");

  const handleSort = (key: SortKey) => () => {
    currentDirection.value = currentDirection.value === "asc" ? "desc" : "asc";

    pokeDexList.mutate = {
      ...pokeDexList.value,
      results: [...pokeDexList.value.results].sort((a, b) => {
        const cmp = a[key].localeCompare(b[key]);
        return currentDirection.value === "asc" ? cmp : -cmp;
      }),
    };
  };

  const changeUrl = (newUrl: string | null) => () => {
    if (newUrl?.length) url.value = newUrl.replace(/limit=\d+/, "limit=20");
  };

  return (
    <div>
      <div class="break-all">Hi {name.value.firstName}</div>
      <table class="w-full mx-auto my-2 table-fixed">
        <thead>
          <tr>
            <th class="w-1/3">ID</th>
            <th
              onClick={handleSort("name")}
              class="select-none cursor-pointer w-1/3"
            >
              Name
            </th>
            <th
              onClick={handleSort("url")}
              class="select-none cursor-pointer w-1/3"
            >
              URL
            </th>
          </tr>
        </thead>
        <tbody>
          <Suspense
            fallback={
              <>
                {Array.from({ length: 20 })
                  .map((_, i) => i + 1)
                  .map((number) => (
                    <tr>
                      <td colspan="3" class="h-[24px] text-center">
                        {number === 10 && "loading..."}
                      </td>
                    </tr>
                  ))}
              </>
            }
          >
            {pokeDexList.value.results.map(({ name, url }, index) => (
              <tr>
                <td class="w-1/3 text-center">{index + 1}</td>
                <td class="w-1/3 text-center truncate">{name}</td>
                <td
                  class="w-1/3 text-center truncate"
                  onClick={() => alert(url)}
                >
                  {url}
                </td>
              </tr>
            ))}
          </Suspense>
        </tbody>
      </table>
      <div class="flex gap-4 justify-center">
        <button
          class="btn"
          onClick={
            !pokeDexList.loading.value && changeUrl(pokeDexList.value.previous)
          }
          disabled={pokeDexList.loading.value || !pokeDexList.value.previous}
        >
          Previous
        </button>
        <button
          class="btn"
          onClick={
            !pokeDexList.loading.value && changeUrl(pokeDexList.value.next)
          }
          disabled={pokeDexList.loading.value || !pokeDexList.value.next}
        >
          Next
        </button>
      </div>
    </div>
  );
};
