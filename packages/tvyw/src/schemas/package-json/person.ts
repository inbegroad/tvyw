import { z } from "zod";

export const personSchema = z.union([
  z.object({
    name: z.string(),
    url: z.string().url().optional(),
    email: z.string().email().optional(),
  }),
  z.string(),
]);
