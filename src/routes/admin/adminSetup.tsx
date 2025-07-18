import { action, redirect, useSubmission } from "@solidjs/router"
import { Show } from "solid-js"
import { queryClient } from "~/app"
import { resetDB, setupPokemonDB } from "~/server/pokemonApi"

const addPokemon = action(async () => {
  "use server"
  try {
    await setupPokemonDB()
  } catch (e) {
    console.log("Failed to save pokemon")
  }
  console.log("Should have saved pokemon")
  throw redirect("/allPokemon")
})

const removeAllFromDB = action(async () => {
  try {
    await resetDB()
    queryClient.invalidateQueries({ queryKey: ["all-pokemon"] })
  } catch (e) {
    console.log("Failed to reset")
  }
  console.log("Should have reset DB")
  throw redirect("/")
})

export default function AdminSetup() {
  const addSubmission = useSubmission(addPokemon);
  return (
    <section class="flex flex-col justify-center items-center gap-8 p-10">
      <h1 class="text-lg">Admin stuff</h1>

      <form action={addPokemon} method="post">
        <button
          type="submit"
          aria-disabled={addSubmission.pending}
          class="border p-2 text-xl"
        >
          {addSubmission.pending ? "Saving to DB" : "Save to DB"}
          <Show when={addSubmission.pending}>
            <div class="min-h-1 animate-pulse bg-gradient-to-r from-blue-400 to-blue-800"></div>
          </Show>
        </button>
      </form>
      <form action={removeAllFromDB} method="post">
        <button type="submit" class="border p-2 bg-red-400">Reset DB</button>
      </form>
    </section>
  )
}
