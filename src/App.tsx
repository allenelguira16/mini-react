import { $effect, $state } from "../mini-react";

export const App = () => {
  console.log("App Rerender"); // When state is updating in the child component, it won't rerender all components, it will just rerender the current component

  return (
    <div style={{ padding: 10, margin: "auto" }}>
      <h1>PokeDex</h1>
      <PokeDexList />
    </div>
  );
};

type PokeDexData = {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
};

const PokeDexList = () => {
  const [pokeDexData, setPokeDexData] = $state<PokeDexData | undefined>();

  const fetchPokeDexData = (url: string | null) => async () => {
    if (!url) return;

    setPokeDexData(undefined);

    const response = await fetch(url);
    const json = await response.json();

    setPokeDexData(json);
  };

  $effect(async () => {
    await fetchPokeDexData("https://pokeapi.co/api/v2/pokemon")();
  }, []);

  if (!pokeDexData) return <div>Loading</div>;
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
          {pokeDexData.results.map(({ name, url }) => (
            <tr>
              <td>{name}</td>
              <td>{url}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button
          onClick={fetchPokeDexData(pokeDexData.previous)}
          disabled={pokeDexData.previous === null}
        >
          Previous
        </button>
        <button
          onClick={fetchPokeDexData(pokeDexData.next)}
          disabled={pokeDexData.next === null}
        >
          Next
        </button>
      </div>
    </div>
  );
};
