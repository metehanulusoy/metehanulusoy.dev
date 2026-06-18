"use client";

import { useEffect } from "react";

/** Adds a hover "Copy" button to every code block inside `.mdx`. */
export function CodeCopy() {
  useEffect(() => {
    const blocks = document.querySelectorAll<HTMLPreElement>(".mdx pre");
    const cleanups: Array<() => void> = [];

    blocks.forEach((pre) => {
      if (pre.querySelector(".copy-btn")) return;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "copy-btn";
      button.textContent = "Copy";
      button.setAttribute("aria-label", "Copy code");

      const onClick = async () => {
        const code = pre.querySelector("code")?.textContent ?? "";
        try {
          await navigator.clipboard.writeText(code);
          button.textContent = "Copied";
          window.setTimeout(() => {
            button.textContent = "Copy";
          }, 1500);
        } catch {
          /* clipboard unavailable — ignore */
        }
      };

      button.addEventListener("click", onClick);
      pre.appendChild(button);
      cleanups.push(() => {
        button.removeEventListener("click", onClick);
        button.remove();
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
