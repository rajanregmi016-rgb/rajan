"use client";

import { useEffect } from "react";

/** Press "/" anywhere (outside a text field) to jump to the search box. */
export default function SearchShortcut() {
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement;
      if (t.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName)) return;
      const box = Array.from(document.querySelectorAll<HTMLInputElement>('input[type="search"]')).find((el) => el.offsetParent !== null);
      if (box) { e.preventDefault(); box.focus(); box.scrollIntoView({ block: "center", behavior: "smooth" }); }
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, []);
  return null;
}
