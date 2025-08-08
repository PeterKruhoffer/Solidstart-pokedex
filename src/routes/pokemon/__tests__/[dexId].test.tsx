import { render, screen } from "@testing-library/solid";
import PokemonDetails from "../[dexId]";
import { createSignal } from "solid-js";

// Mock useParams to return a fixed dexId
jest.mock("@solidjs/router", () => ({
  useParams: () => ({ dexId: "1" }),
  createAsync: (fn) => {
    const [data, setData] = createSignal();
    fn().then(setData);
    return data;
  },
  query: (fn) => fn,
}));

// Mock getPokemonById to return sample data
jest.mock("~/server/pokemonApi", () => ({
  getPokemonById: async (id) => ({
    id: 1,
    name: "bulbasaur",
    height: 7,
    weight: 69,
    types: [{ type: { name: "grass" } }, { type: { name: "poison" } }],
    abilities: [{ ability: { name: "overgrow" } }],
    stats: [
      { stat: { name: "hp" }, base_stat: 45 },
      { stat: { name: "attack" }, base_stat: 49 },
    ],
    sprites: { front_default: "bulbasaur.png" },
  }),
}));

describe("PokemonDetails", () => {
  it("renders Pokemon details correctly", async () => {
    render(() => <PokemonDetails />);
    expect(await screen.findByText(/bulbasaur/i)).toBeInTheDocument();
    expect(screen.getByText(/ID: 1/i)).toBeInTheDocument();
    expect(screen.getByText(/grass/i)).toBeInTheDocument();
    expect(screen.getByText(/poison/i)).toBeInTheDocument();
    expect(screen.getByText(/Height: 0.7 m/i)).toBeInTheDocument();
    expect(screen.getByText(/Weight: 6.9 kg/i)).toBeInTheDocument();
    expect(screen.getByText(/overgrow/i)).toBeInTheDocument();
    expect(screen.getByText(/hp:/i)).toBeInTheDocument();
    expect(screen.getByText(/attack:/i)).toBeInTheDocument();
  });
});
