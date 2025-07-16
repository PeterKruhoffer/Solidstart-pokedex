import { action } from "@solidjs/router"
import { useQuery } from "@tanstack/solid-query"
import { Schema } from "effect"
import { PokemonType } from "pokenode-ts"
import { createSignal, For, Match, Suspense, Switch } from "solid-js"
import { getPokemonById, MyPokemon, savePokemonToDB } from "~/server/pokemonApi"

const addPokemon = action(async (formData: FormData) => {
  "use server"
  const id = Number(formData.get("id"))
  const name = formData.get("name") as string
  const sprite = formData.get("sprite") as string
  const types = formData.get("types") as string

  const parsedTypes = JSON.parse(types) as PokemonType[]
  const mappedTypes = parsedTypes.map(t => t.type.name)

  const pokemon = { id, name, types: mappedTypes, sprite }
  const encodedPokemon = Schema.encodeSync(MyPokemon)(pokemon)

  try {
    await savePokemonToDB(encodedPokemon)
  } catch (e) {
    console.log("Failed to save pokemon")
  }
  console.log("Should have saved pokemon")
})

export default function Playground() {
  const [dexNumber, setDexNumber] = createSignal(1)
  const query = useQuery(() => ({
    queryKey: ["pokemon-db", dexNumber()],
    queryFn: () => getPokemonById(dexNumber()),
    staleTime: Infinity
  }))

  return (
    <section class="grid grid-cols-12 gap-4 place-items-center">
      <h1 class="text-xl col-span-12">Playground</h1>
      <button onClick={() => setDexNumber((prev) => prev + 1)}>Next</button>

      <Suspense>
        <Switch>
          <Match when={query.isPending}><p>Loading...</p></Match>
          <Match when={query.isError}>Error: {query.error?.message}</Match>
          <Match when={query.isSuccess}>
            <div class="col-span-12 flex flex-col justify-center items-center gap-4">
              <div >
                <p class="text-lg uppercase">{query.data?.name}</p>
                <p class="text-lg uppercase">#{query.data?.id}</p>
              </div>
              <div class="flex flex-row gap-x-4">
                <For each={query.data?.types}>
                  {(type) => (
                    <p class="border px-2">{type.type.name}</p>
                  )}
                </For>
              </div>
              <img src={query.data?.sprites.front_default ?? ""} alt={query.data?.name} class="size-52 pixelated border" />
              <form action={addPokemon} method="post">
                <input name="id" value={query.data?.id} hidden />
                <input name="name" value={query.data?.name} hidden />
                <input name="sprite" value={query.data?.sprites.front_default ?? "no_sprite"} hidden />
                <input name="types" value={JSON.stringify(query.data?.types)} hidden />
                <button type="submit" class="border p-2">Save to DB</button>
              </form>
            </div>
          </Match>
        </Switch>
      </Suspense>
    </section>
  )
}
