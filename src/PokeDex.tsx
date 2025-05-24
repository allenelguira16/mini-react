import { effect, state, Fragment } from "../mini-app";

type PokeDexData = {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
};

export const PokeDex = () => {
  const [pokeDexData, setPokeDexData] = state<PokeDexData | undefined>();

  const fetchPokeDexData = (url: string | null) => async () => {
    if (!url) return;

    const response = await fetch(url);
    const json = await response.json();

    setPokeDexData(json);
  };

  effect(async () => {
    await fetchPokeDexData("https://pokeapi.co/api/v2/pokemon")();
  });

  return (
    <div>
      {!pokeDexData() && <div>loading</div>}
      {pokeDexData() && (
        <>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>URL</th>
              </tr>
            </thead>
            <tbody>
              {pokeDexData()?.results.map(({ name, url }) => (
                <tr>
                  <td>{name}</td>
                  <td>{url}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <button
              onClick={fetchPokeDexData(pokeDexData()?.previous || "")}
              disabled={!pokeDexData()?.previous}
            >
              Previous
            </button>
            <button
              onClick={fetchPokeDexData(pokeDexData()?.next || "")}
              disabled={!pokeDexData()?.next || ""}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// function Show<T>({}: { when: T, fallback: HTMLDivElement }) {
//   return (

//   )
// }
