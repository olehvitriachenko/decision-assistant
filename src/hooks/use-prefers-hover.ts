"use client";

import { useEffect, useState } from "react";

export function usePrefersHover() {
  const [prefersHover, setPrefersHover] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

    function updatePreference() {
      setPrefersHover(mediaQuery.matches);
    }

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return prefersHover;
}
