"use server"

import { Effect } from "effect"
import { Pokemon, PokemonClient } from "pokenode-ts"

const pokemonClient = new PokemonClient()

function fetchPokemonById(id: number): Effect.Effect<Pokemon, Error> {
  return Effect.tryPromise({
    try: () => pokemonClient.getPokemonById(id),
    catch: () => new Error("[FETCH_POKEMON_BY_ID] failed to get pokemon by id",)
  })
}

export async function getPokemonById(id: number) {
  const pokemon = await Effect.runPromise(fetchPokemonById(id))
  return pokemon
}
