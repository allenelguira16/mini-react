import { resource, store, Suspense } from "@veltra/app";
import { sleep } from "src/sleep";

import { name } from "../globalState";

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
  return (
    <div>
      <div class="break-all">Hi {name.firstName}</div>
      <table class="w-full mx-auto my-2 table-fixed">
        <thead>
          <tr>
            <th class="w-1/3">ID</th>
            <th onClick={() => pokeDex.sort("name")} class="select-none cursor-pointer w-1/3">
              Name
            </th>
            <th onClick={() => pokeDex.sort("url")} class="select-none cursor-pointer w-1/3">
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
            {pokeDexResource.data.results.map(({ name, url }, index) => (
              <tr>
                <td class="w-1/3 text-center">{index + 1}</td>
                <td class="w-1/3 text-center truncate">{name}</td>
                <td class="w-1/3 text-center truncate" onClick={() => alert(url)}>
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
          onClick={() => pokeDex.changeUrl(pokeDexResource.data.previous)}
          disabled={pokeDexResource.loading || !pokeDexResource.data.previous}
        >
          Previous
        </button>
        <button
          class="btn"
          onClick={() => pokeDex.changeUrl(pokeDexResource.data.next)}
          disabled={pokeDexResource.loading || !pokeDexResource.data.next}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const pokeDex = store({
  url: "https://pokeapi.co/api/v2/pokemon/?offset=1100&limit=20",
  sortDirection: "asc" as SortDirection,
  sort(key: SortKey) {
    this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";

    pokeDexResource.mutate({
      ...pokeDexResource.data,
      results: [...pokeDexResource.data.results].sort((a, b) => {
        const cmp = a[key].localeCompare(b[key]);
        return this.sortDirection === "asc" ? cmp : -cmp;
      }),
    });
  },
  changeUrl(newUrl: string | null) {
    if (pokeDexResource.loading || !newUrl) return;

    this.url = newUrl.replace(/limit=\d+/, "limit=20");
  },
});

const pokeDexResource = resource(async () => {
  const response = await fetch(pokeDex.url);
  const json = (await response.json()) as PokeDexData;

  await sleep(500);

  return json;
});
