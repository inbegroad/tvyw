import { z } from "zod";

export const packageExportObjectSchema = z.object({
  require: z.string().optional(),
  import: z.string().optional(),
  node: z.string().optional(),
  default: z.string().optional(),
});

export const packageDefaultExportSchema = z.object({
  ".": packageExportObjectSchema,
});
export const packageExportSchema = z.union([
  packageDefaultExportSchema.optional(),
  z.record(packageExportObjectSchema).optional(),
]);
