import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Metehan Ulusoy",
    short_name: "Metehan",
    description: "Portfolio and technical blog of Metehan Ulusoy — software & AI engineering.",
    start_url: "/",
    display: "standalone",
    background_color: "#0c0b16",
    theme_color: "#0c0b16",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
