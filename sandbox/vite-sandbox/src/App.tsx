import { Dropdowns } from "./components/DropdownList";
import { PokeDex } from "./components/PokeDex";
import { Forms } from "./components/Forms";
import { PokeDexSuspense } from "./components/PokeDexSuspense";
import { navigate, location, Route, Router } from "@veltra/router";

export const App = () => {
  const routes: Route[] = [
    {
      path: "/pokedex-list",
      component: () => (
        <Template title="Dropdown List">
          <PokeDex />
        </Template>
      ),
    },
    {
      path: "/pokedex-list-suspense",
      component: () => (
        <Template title="Dropdown List">
          <PokeDexSuspense />
        </Template>
      ),
    },
    {
      path: "/dropdown-list",
      component: () => (
        <Template title="Dropdown List">
          <Dropdowns />
        </Template>
      ),
    },
    {
      path: "/forms",
      component: () => (
        <Template title="Dropdown List">
          <Forms />
        </Template>
      ),
    },
  ];

  return (
    <>
      <div class="p-2 flex flex-col container m-auto">
        <ButtonPageList />
        <Router routes={routes} />
      </div>
    </>
  );
};

const Template = ({
  title,
  children,
}: {
  title: string;
  children: JSX.Element;
}) => {
  return (
    <div class="p-2 w-full">
      <h1 class="font-bold text-2xl mb-2">{title}</h1>
      {children}
    </div>
  );
};

const ButtonPageList = () => {
  return (
    <Template title="Pages">
      <ul class="flex flex-col gap-2">
        <li>
          <button
            onClick={() => navigate("/pokedex-list")}
            disabled={location.value.pathname === "/pokedex-list"}
          >
            PokeDex List
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate("/pokedex-list-suspense")}
            disabled={location.value.pathname === "/pokedex-list-suspense"}
          >
            PokeDex List with Suspense
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate("/dropdown-list")}
            disabled={location.value.pathname === "/dropdown-list"}
          >
            Dropdown Lists
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate("/forms")}
            disabled={location.value.pathname === "/forms"}
          >
            Forms
          </button>
        </li>
      </ul>
    </Template>
  );
};
