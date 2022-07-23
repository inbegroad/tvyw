import { z } from "zod";

export const fundingWaySchema = z.object({
  url: z.string().url().optional(),
  type: z.string().optional(),
});

export const fundingSchema = z.union([
  z.string(),
  fundingWaySchema,
  z.array(z.union([fundingWaySchema, z.string()])),
]);
