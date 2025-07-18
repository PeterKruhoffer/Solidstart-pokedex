import { useLocation } from "@solidjs/router";

export default function Nav() {
  const location = useLocation();
  const active = (path: string) =>
    path == location.pathname ? "border-sky-600" : "border-transparent hover:border-sky-600";
  return (
    <nav class="bg-sky-800">
      <ul class="container flex items-center p-3 text-gray-200">
        <li class={`border-b-2 ${active("/")} mx-1.5 sm:mx-6`}>
          <a href="/">Home</a>
        </li>
        <li class={`border-b-2 ${active("/about")} mx-1.5 sm:mx-6`}>
          <a href="/about">About</a>
        </li>
        <li class={`border-b-2 ${active("/playground")} mx-1.5 sm:mx-6`}>
          <a href="/playground">Playground</a>
        </li>
        <li class={`border-b-2 ${active("/allPokemon")} mx-1.5 sm:mx-6`}>
          <a href="/allPokemon">All-Pokemon</a>
        </li>
        <li class={`border-b-2 ${active("/admin/adminSetup")} mx-1.5 sm:mx-6`}>
          <a href="/admin/adminSetup">Admin</a>
        </li>
      </ul>
    </nav>
  );
}
