import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import compress from "astro-compress";
import robotsTxt from "astro-robots-txt";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";

export default defineConfig({
  site: "https://dekersenboomgaard.nl",
  output: "static",
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react(), compress(), robotsTxt(), sitemap()],
});
