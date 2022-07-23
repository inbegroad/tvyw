import { z } from "zod";

export const sctiptsSchema = z
  .object({
    lint: z
      .string()
      .describe("Run code quality tools, e.g. ESLint, TSLint, etc.")
      .optional(),
    prepublish: z
      .string()
      .describe(
        "Run BEFORE the package is published (Also run on local npm install without any arguments)."
      )
      .optional(),
    prepare: z
      .string()
      .describe(
        "Run both BEFORE the package is packed and published, and on local npm install without any arguments. This is run AFTER prepublish, but BEFORE prepublishOnly."
      )
      .optional(),
    prepublishOnly: z
      .string()
      .describe(
        "Run BEFORE the package is prepared and packed, ONLY on npm publish."
      )
      .optional(),
    prepack: z
      .string()
      .describe(
        "run BEFORE a tarball is packed (on npm pack, npm publish, and when installing git dependencies)."
      )
      .optional(),
    postpack: z
      .string()
      .describe(
        "Run AFTER the tarball has been generated and moved to its final destination."
      )
      .optional(),
    publish: z
      .string()
      .describe(
        "Publishes a package to the registry so that it can be installed by name. See https://docs.npmjs.com/cli/v8/commands/npm-publish"
      )
      .optional(),
    postpublish: z.string().optional(),
    preinstall: z
      .string()
      .describe("Run BEFORE the package is installed.")
      .optional(),
    install: z.string().optional(),
    postinstall: z.string().optional(),
    preuninstall: z.string().optional(),
    uninstall: z.string().optional(),
    postuninstall: z
      .string()
      .describe("Run AFTER the package is uninstalled.")
      .optional(),
    preversion: z.string().optional(),
    version: z.string().optional(),
    postversion: z
      .string()
      .describe("Run AFTER bump the package version.")
      .optional(),
    pretest: z.string().optional(),
    test: z.string().optional(),
    posttest: z.string().optional(),
    prestop: z.string().optional(),
    stop: z.string().optional(),
    poststop: z.string().optional(),
    prestart: z.string().optional(),
    start: z.string().optional(),
    poststart: z.string().optional(),
    prerestart: z.string().optional(),
    restart: z.string().optional(),
    postrestart: z.string().optional(),
    serve: z
      .string()
      .describe("Start dev server to serve application files")
      .optional(),
  })
  .catchall(z.string())
  .describe(
    "The 'scripts' member is an object hash of script commands that are run at various times in the lifecycle of your package. The key is the lifecycle event, and the value is the command to run at that point."
  )
  .optional();
