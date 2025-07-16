import { useQuery } from "@tanstack/solid-query";
import { createSignal, For, Match, Show, Switch } from "solid-js";
import { getPokemonById } from "~/serverStuff";

export default function Home() {
  const [isFlipped, setIsFlipped] = createSignal(false)
  const query = useQuery(() => ({
    queryKey: ["pokemon-id"],
    queryFn: () => getPokemonById(1025),
    staleTime: Infinity
  }))

  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">Hello world!</h1>
      <Switch>
        <Match when={query.isPending}><p>Loading...</p></Match>
        <Match when={query.isError}>Error: {query.error?.message}</Match>
        <Match when={query.isSuccess}>
          <div class="flex flex-col justify-center items-center gap-4">
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
            <Show when={isFlipped() == false}>
              <img src={query.data?.sprites.front_default ?? ""} alt={query.data?.name} class="size-52 pixelated border" onClick={() => setIsFlipped(true)} />
            </Show>
            <Show when={isFlipped() == true}>
              <img src={query.data?.sprites.back_default ?? ""} alt={query.data?.name} class="size-52 pixelated border" onClick={() => setIsFlipped(false)} />
            </Show>
          </div>
        </Match>
      </Switch>
    </main>
  );
}
