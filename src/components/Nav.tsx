import { useLocation, A } from "@solidjs/router";

export default function Nav() {
  const location = useLocation();
  const active = (path: string) =>
    path == location.pathname
      ? "border-sky-600"
      : "border-transparent hover:border-sky-600";
  return (
    <nav class="bg-sky-800">
      <ul class="container flex items-center p-3 text-gray-200 gap-x-2">
        <li class={`border-b-2 ${active("/")} px-1.5 sm:px-6 relative`}>
          <A href="/">
            <span class="absolute inset-0" />
            Home
          </A>
        </li>
        <li class={`border-b-2 ${active("/about")} px-1.5 sm:px-6 relative`}>
          <A href="/about">
            <span class="absolute inset-0" />
            About
          </A>
        </li>
        <li
          class={`border-b-2 ${active("/playground")} px-1.5 sm:px-6 relative`}
        >
          <A href="/playground">
            <span class="absolute inset-0" />
            Playground
          </A>
        </li>
        <li
          class={`border-b-2 ${active("/allPokemon")} px-1.5 sm:px-6 relative`}
        >
          <A href="/allPokemon">
            <span class="absolute inset-0" />
            All-Pokemon
          </A>
        </li>
        <li
          class={`border-b-2 ${active("/adminSetup")} px-1.5 sm:px-6 relative`}
        >
          <A href="/adminSetup">
            <span class="absolute inset-0" />
            Admin
          </A>
        </li>
      </ul>
    </nav>
  );
}
