import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const artists = defineCollection({
  loader: glob({ pattern: "*.md", base: "./content/artists" }),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    profession: z.string().default(""),
    link: z.string().default(""),
    house_number: z.number(),
  }),
});

const courses = defineCollection({
  loader: glob({ pattern: "*.md", base: "./content/courses" }),
  schema: z.object({
    artist_ids: z.string().default(""),
    name: z.string(),
    link: z.string().default(""),
    start_month: z.number().optional(),
    end_month: z.number().optional(),
  }),
});

const agenda = defineCollection({
  loader: glob({ pattern: "*.md", base: "./content/agenda" }),
  schema: z.object({
    title: z.string(),
    start_date: z.coerce.string(),
    start_time: z.string().optional(),
    end_date: z.coerce.string().optional(),
    end_time: z.coerce.string().optional(),
    event_link: z.string().default(""),
  }),
});

const expositions = defineCollection({
  loader: glob({ pattern: "*.md", base: "./content/expositions" }),
  schema: z.object({
    title: z.string(),
    start_date: z.coerce.string(),
    start_time: z.string().optional(),
    end_date: z.coerce.string().optional(),
    end_time: z.coerce.string().optional(),
    location: z.string().default(""),
    address: z.string().default(""),
    curator: z.string().default(""),
    opening_event_time: z.string().optional(),
    opening_event_description: z.string().optional(),
    artist_ids: z.string().default(""),
    link: z.string().optional(),
  }),
});

export const collections = { artists, courses, agenda, expositions };
