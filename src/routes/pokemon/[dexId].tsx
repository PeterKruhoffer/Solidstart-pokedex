import { createAsync, query, useParams } from "@solidjs/router";
import { Pokemon } from "pokenode-ts";
import { Show } from "solid-js";
import { getPokemonById } from "~/server/pokemonApi";

const getPokemonDetails = query(async (id) => {
  const pokemon = await getPokemonById(id);
  return pokemon;
}, "pokemon-details");

export const route = {
  preload: (id: number) => getPokemonDetails(id),
};

export default function PokemonDetails() {
  const param = useParams();
  const pokemonDetails = createAsync(() => getPokemonDetails(param.dexId));
  return (
    <section class="grid grid-cols-12 gap-8 p-10">
      <h1 class="text-2xl col-span-12">PokemonDetails {param.dexId}</h1>
      <Show when={pokemonDetails()}>
        {(details) => <PokemonBreakdownDetails details={details()} />}
      </Show>
    </section>
  );
}

function PokemonBreakdownDetails(props: { details: Pokemon }) {
  return (
    <div class="col-span-12 flex flex-col items-center">
      <h2 class="text-3xl font-bold capitalize">{props.details.name}</h2>
      <p class="text-lg">ID: {props.details.id}</p>
      <img
        src={props.details.sprites?.front_default ?? ""}
        alt={props.details.name}
        class="w-40 h-40 pixelated"
      />
      <div class="mt-4 w-full max-w-xl">
        <h3 class="text-xl font-semibold mb-2">Types</h3>
        <ul class="flex gap-4 flex-wrap">
          {props.details.types?.map((typeInfo) => {
            const typeName = typeInfo.type.name;
            const typeColors = {
              normal: "bg-gray-400 text-white",
              fire: "bg-red-500 text-white",
              water: "bg-blue-500 text-white",
              electric: "bg-yellow-400 text-black",
              grass: "bg-green-500 text-white",
              ice: "bg-cyan-300 text-black",
              fighting: "bg-red-700 text-white",
              poison: "bg-purple-600 text-white",
              ground: "bg-yellow-700 text-white",
              flying: "bg-indigo-300 text-black",
              psychic: "bg-pink-500 text-white",
              bug: "bg-green-700 text-white",
              rock: "bg-yellow-800 text-white",
              ghost: "bg-indigo-700 text-white",
              dragon: "bg-purple-800 text-white",
              dark: "bg-gray-800 text-white",
              steel: "bg-gray-500 text-white",
              fairy: "bg-pink-300 text-black",
            };
            const badgeClass =
              typeColors[typeName as keyof typeof typeColors] ||
              "bg-gray-300 text-black";
            return (
              <li
                class={`capitalize px-3 py-1 rounded font-semibold ${badgeClass}`}
              >
                {typeName}
              </li>
            );
          })}
        </ul>{" "}
        <div class="mt-6">
          <h3 class="text-xl font-semibold mb-2">Physical Attributes</h3>
          <p>Height: {(props.details.height / 10).toFixed(1)} m</p>
          <p>Weight: {(props.details.weight / 10).toFixed(1)} kg</p>
        </div>
        <div class="mt-6">
          <h3 class="text-xl font-semibold mb-2">Abilities</h3>
          <ul class="list-disc list-inside">
            {props.details.abilities?.map((abilityInfo) => (
              <li class="capitalize">{abilityInfo.ability.name}</li>
            ))}
          </ul>
        </div>
        <div class="mt-6">
          <h3 class="text-xl font-semibold mb-2">Base Stats</h3>
          <ul class="space-y-1">
            {props.details.stats?.map((statInfo) => (
              <li>
                <span class="capitalize font-medium">
                  {statInfo.stat.name}:
                </span>{" "}
                {statInfo.base_stat}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
