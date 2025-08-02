import { useLocation, A } from "@solidjs/router";
import { onMount } from "solid-js";

const SESSIONSTORAGEKEY = "lastFocusedNavLink";

function getAllLinks(nav: HTMLElement) {
  return Array.from(nav.querySelectorAll<HTMLAnchorElement>("a"));
}

export default function Nav() {
  const location = useLocation();
  const active = (path: string) =>
    path == location.pathname
      ? "border-sky-600"
      : "border-transparent hover:border-sky-600";

  let navRef: HTMLElement | undefined;

  // Keydown handler for arrow navigation
  function onKeyDown(event: KeyboardEvent) {
    if (!navRef) return;
    const focusableLinks = getAllLinks(navRef);

    const currentIndex = focusableLinks.findIndex(
      (link) => link === document.activeElement,
    );

    if (event.key === "ArrowRight") {
      if (currentIndex < focusableLinks.length - 1) {
        focusableLinks[currentIndex + 1].focus();
        event.preventDefault();
        sessionStorage.setItem(
          SESSIONSTORAGEKEY,
          focusableLinks[currentIndex + 1].getAttribute("href") || "",
        );
      }
    } else if (event.key === "ArrowLeft") {
      if (currentIndex > 0) {
        focusableLinks[currentIndex - 1].focus();
        event.preventDefault();
        sessionStorage.setItem(
          SESSIONSTORAGEKEY,
          focusableLinks[currentIndex - 1].getAttribute("href") || "",
        );
      }
    }
  }

  function restoreFocus() {
    let focusableLinks: HTMLAnchorElement[] = [];
    if (!navRef) return;
    if (focusableLinks.length === 0) {
      focusableLinks = getAllLinks(navRef);
    }

    const lastFocusedHref = sessionStorage.getItem(SESSIONSTORAGEKEY);
    let toFocus: HTMLAnchorElement | undefined;

    if (lastFocusedHref) {
      toFocus = focusableLinks.find(
        (link) => link.getAttribute("href") === lastFocusedHref,
      );
    }

    if (!toFocus && focusableLinks.length > 0) {
      toFocus = focusableLinks[0];
    }

    if (toFocus && document.activeElement !== toFocus) {
      toFocus.focus();
      sessionStorage.setItem(
        SESSIONSTORAGEKEY,
        toFocus.getAttribute("href") || "",
      );
    }
  }

  // On mount, restore focus to last visited link or first link
  onMount(() => {
    restoreFocus();
  });

  // When nav receives focus, focus last visited or first link
  function onNavFocus() {
    restoreFocus();
  }

  return (
    <nav
      class="bg-sky-800"
      role="navigation"
      aria-label="Primary navigation"
      tabindex={0}
      ref={navRef}
      onKeyDown={onKeyDown}
      onFocus={onNavFocus}
    >
      <ul
        class="container flex items-center p-3 text-gray-200 gap-x-2"
        role="menubar"
      >
        <li
          class={`border-b-2 ${active("/")} px-1.5 sm:px-6 relative`}
          role="none"
        >
          <A href="/" role="menuitem" tabindex={-1}>
            <span class="absolute inset-0" />
            Home
          </A>
        </li>
        <li
          class={`border-b-2 ${active("/about")} px-1.5 sm:px-6 relative`}
          role="none"
        >
          <A href="/about" role="menuitem" tabindex={-1}>
            <span class="absolute inset-0" />
            About
          </A>
        </li>
        <li
          class={`border-b-2 ${active("/playground")} px-1.5 sm:px-6 relative`}
          role="none"
        >
          <A href="/playground" role="menuitem" tabindex={-1}>
            <span class="absolute inset-0" />
            Playground
          </A>
        </li>
        <li
          class={`border-b-2 ${active("/allPokemon")} px-1.5 sm:px-6 relative`}
          role="none"
        >
          <A href="/allPokemon" role="menuitem" tabindex={-1}>
            <span class="absolute inset-0" />
            All-Pokemon
          </A>
        </li>
        <li
          class={`border-b-2 ${active("/adminSetup")} px-1.5 sm:px-6 relative`}
          role="none"
        >
          <A href="/adminSetup" role="menuitem" tabindex={-1}>
            <span class="absolute inset-0" />
            Admin
          </A>
        </li>
      </ul>
    </nav>
  );
}
