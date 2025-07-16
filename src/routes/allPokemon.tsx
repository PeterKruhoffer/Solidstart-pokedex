import { useQuery } from "@tanstack/solid-query"
import { createMemo, createSignal, For, Match, onCleanup, Show, Suspense, Switch } from "solid-js"
import { getAllPokemonFromDB, MyPokemon } from "~/server/pokemonApi"

type colorMatch = {
  bg: string
  color: string
}

const typeColors: Record<string, colorMatch> = {
  normal: { bg: '#A8A77A', color: "black" },
  fire: { bg: '#EE8130', color: "black" },
  water: { bg: '#6390F0', color: "black" },
  electric: { bg: '#F7D02C', color: "black" },
  grass: { bg: '#7AC74C', color: 'black' },
  ice: { bg: '#96D9D6', color: "black" },
  fighting: { bg: '#C22E28', color: "white" },
  poison: { bg: '#A33EA1', color: "white" },
  ground: { bg: '#E2BF65', color: "black" },
  flying: { bg: '#A98FF3', color: "black" },
  psychic: { bg: '#F95587', color: "black" },
  bug: { bg: '#A6B91A', color: "black" },
  rock: { bg: '#B6A136', color: "black" },
  ghost: { bg: '#735797', color: "white" },
  dragon: { bg: '#6F35FC', color: "white" },
  dark: { bg: '#705746', color: "white" },
  steel: { bg: '#B7B7CE', color: "black" },
  fairy: { bg: '#D685AD', color: "black" }
}

export default function AllPokemon() {
  const [search, setSearch] = createSignal("")
  const query = useQuery(() => ({
    queryKey: ["all-pokemon"],
    queryFn: () => getAllPokemonFromDB(),
    staleTime: Infinity
  }))

  const filteredTypes = createMemo(() => {
    return query.data?.filter((d) => {
      return d.types.includes(search()) || d.name.includes(search())
    })
  })

  let timeoutId: number | undefined
  function handleInput(e: InputEvent & {
    currentTarget: HTMLInputElement;
  }) {
    const newValue = e.currentTarget.value

    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = window.setTimeout(() => {
      setSearch(newValue)
    }, 250)
  }

  onCleanup(() => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  })

  return (
    <section class="grid grid-cols-12 gap-8 p-10">
      <h1 class="col-span-12">All Pokemon in DB</h1>

      <div class="col-span-6 col-start-4 w-full py-8">
        <DebounceInput searchQuery={search()} handleInput={handleInput} />

        <Show when={search() !== "" && filteredTypes()?.length === 0}>
          <p class="text-lg text-center py-8">No results for search</p>
        </Show>
      </div>
      <Suspense>
        <div class="col-span-12 w-full">
          <Show when={filteredTypes() !== undefined}>
            <PokemonGrid pokemonList={filteredTypes()!} />
          </Show>
          <Switch>
            <Match when={query.isPending}><p>Loading...</p></Match>
            <Match when={query.isError}>Error: {query.error?.message}</Match>
            <Match when={query.isSuccess && (filteredTypes() === undefined || filteredTypes()?.length === 0)}>
              <PokemonGrid pokemonList={query.data!} />
            </Match>
          </Switch>
        </div>
      </Suspense>
    </section >
  )
}

type DebounceInputProps = {
  searchQuery: string
  handleInput: (e: InputEvent & {
    currentTarget: HTMLInputElement;
    target: HTMLInputElement;
  }) => void
}

function DebounceInput(props: DebounceInputProps) {
  return (
    <input
      value={props.searchQuery}
      onInput={props.handleInput}
      placeholder="search types or names"
      class="p-2 w-full border col-span-6 col-start-4"
    />
  )
}


type PokemonGridProps = { pokemonList: MyPokemon[] }

function PokemonGrid(props: PokemonGridProps) {
  return (
    <div class="grid grid-cols-3 gap-4">
      <For each={props.pokemonList}>
        {(poke) => (
          <div class="flex flex-col justify-center items-center gap-4 border">
            <div >
              <p class="text-lg uppercase text-center">{poke.name}</p>
              <p class="text-lg uppercase text-center">#{poke.id}</p>
            </div>
            <div class="flex flex-row gap-x-4">
              <For each={poke.types}>
                {(type) => (
                  <div class="px-2" style={{ "background-color": typeColors[type.toLowerCase()].bg }}>
                    <p style={{ "color": typeColors[type.toLowerCase()].color }}>{type}</p>
                  </div>
                )}
              </For>
            </div>
            <img src={poke.sprite} alt={poke.name} class="size-52 pixelated border" />
          </div>
        )}
      </For>
    </div>
  )
}
