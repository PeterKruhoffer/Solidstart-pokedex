"use server"
import { Console, Data, Effect, Schedule, Schema } from "effect"
import { Pokemon, PokemonClient } from "pokenode-ts"
import { db } from "./db"
import { pokemonTable } from "./schema"
import { eq } from "drizzle-orm"

export const MyPokemon = Schema.Struct({
  id: Schema.Number,
  name: Schema.String,
  types: Schema.Array(Schema.String),
  sprite: Schema.String
})

export type MyPokemon = Schema.Schema.Type<typeof MyPokemon>

const pokemonClient = new PokemonClient()

class FetchPokemonByIdError extends Data.TaggedError("FetchPokemonByIdError")<{}> { }

function fetchPokemonById(id: number): Effect.Effect<Pokemon, FetchPokemonByIdError> {
  return Effect.tryPromise({
    try: () => pokemonClient.getPokemonById(id),
    catch: () => new FetchPokemonByIdError()
  })
}

export async function getPokemonById(id: number) {
  const pokemon = await Effect.runPromise(fetchPokemonById(id))
  return pokemon
}

class SavePokemonToDBError extends Data.TaggedError("SavePokemonToDBError")<{}> { }
function trySavePokemonToDB(pokemon: MyPokemon) {
  return Effect.tryPromise({
    try: () => db.insert(pokemonTable).values({
      id: pokemon.id,
      name: pokemon.name,
      types: pokemon.types,
      sprite: pokemon.sprite,
    }),
    catch: () => new SavePokemonToDBError(),
  })
}

export async function savePokemonToDB(pokemon: MyPokemon) {
  await Effect.runPromise(trySavePokemonToDB(pokemon))
  return
}

class GetAllPokemonFromDBError extends Data.TaggedError("GetAllPokemonFromDBError")<{}> { }
function tryGetAllPokemonFromDB() {
  return Effect.tryPromise({
    try: () => db.select().from(pokemonTable),
    catch: () => new GetAllPokemonFromDBError()
  })
}

export async function getAllPokemonFromDB() {
  const allPokemon = await Effect.runPromise(tryGetAllPokemonFromDB())
  return allPokemon
}

let dexNumber = 1

const trySetupPokemonDB = Effect.gen(function* () {
  const pokemon = yield* fetchPokemonById(dexNumber)
  yield* Console.log(`${pokemon.name} fetched`)

  const { id, name, types, sprites } = pokemon
  const mappedTypes = types.map(t => t.type.name)
  const sprite = sprites.front_default ?? "no_sprite"

  const newPokemon = { id, name, types: mappedTypes, sprite }

  const encodedPokemon = Schema.encodeSync(MyPokemon)(newPokemon)
  yield* trySavePokemonToDB(encodedPokemon)
  yield* Console.log(`#${dexNumber} should be save to DB`)
  dexNumber++
}).pipe(
  Effect.catchTags({
    FetchPokemonByIdError: (error) => Effect.succeed(`[Fetch_Pokemon_By_Id_Error]: ${error.message}`),
    SavePokemonToDBError: (error) => Effect.succeed(`[Save_Pokemon_To_DB_Error]: ${error.message}`),
  })
)

// 385 = pokemon gens 1, 2 and 3
// 1025 toal pokemon in dex
const policy = Schedule.addDelay(Schedule.recurs(1025), () => "300 millis")
const program = Effect.repeat(trySetupPokemonDB, policy)

export async function setupPokemonDB() {
  await Effect.runPromise(program);
}

class ResetDBError extends Data.TaggedError("ResetDBError")<{}> { }

function tryResetDB() {
  return Effect.tryPromise({
    try: () => db.delete(pokemonTable),
    catch: () => new ResetDBError()
  })
}

export async function resetDB() {
  return await Effect.runPromise(tryResetDB())
}

class DeletePokemonFromDBError extends Data.TaggedError("DeletePokemonFromDBError")<{}> { }
function tryDeletePokemonFromDB(id: number) {
  return Effect.tryPromise({
    try: () => db.delete(pokemonTable).where(eq(pokemonTable.id, id)),
    catch: () => new DeletePokemonFromDBError()
  })
}

export async function deletePokemonFromDB(id: number) {
  return await Effect.runPromise(tryDeletePokemonFromDB(id))
}
