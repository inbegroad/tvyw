// import { LibraryFormats } from "vite";
import { z } from "zod";
// import { setToArray } from "../tools/set-to-array";
import {
  frameworksZod,
  repoTypeEnum,
  // workspaceStructureZod,
  workspaceTypeZod,
} from "./enums";

// const formatsEnum = z.enum(["cjs", "es", "iife", "umd"]);

// const formats: z.ZodType<LibraryFormats[]> = z.array(formatsEnum);

const projectSchema = {
  packageName: z
    .string()
    .regex(
      new RegExp("^(?:@[a-z0-9-*~][a-z0-9-*._~]*/)?[a-z0-9-~][a-z0-9-._~]*$")
    ),
  buildDir: z.string(),
  declarationDir: z.string(),
  entries: z.string(),
  entriesDir: z.string(),
  extraInclude: z.string().array(),
  extraExclude: z.string().array(),
  extraReferences: z.object({ path: z.string() }).array(),
  framework: frameworksZod,
  testsDir: z.string(),
  deploy: z.boolean().optional(),
  workspaceType: workspaceTypeZod,
  disableTypescript: z.boolean().optional(),
  typeSource: z.string().optional(),
  gitIgnore: z.string().optional(),
  npmIgnore: z.string().optional(),
  fullPath: z.string().optional(),
  location: z.string().optional(),
  // workspaceStructure: workspaceStructureZod,
};

const monoRootSchemaEl = {
  appsRootDir: z.string(),
  extraWorkspaces: z.string().array(),
  packagesRootDir: z.string(),
};

const monoRootSchema = z.object({
  repoType: z.literal("monoRepo"),
  root: z.literal(true),
  ...monoRootSchemaEl,
});
const monoWorkspaceSchema = z.object({
  repoType: z.literal("monoRepo"),
  root: z.literal(false),
  ...projectSchema,
});
const singleSchema = z.object({
  repoType: z.literal("single"),
  ...projectSchema,
});
export const projManSchema = z.union([
  monoRootSchema,
  monoWorkspaceSchema,
  singleSchema,
]);

export const createProjManSchema = z.object({
  repoType: z.enum(repoTypeEnum),
  root: z.boolean(),
  ...monoRootSchemaEl,
  ...projectSchema,
});
