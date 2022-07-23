import { z } from "zod";
import {
  packageJsonPublishConfigAccessEnum,
  packageJsonTypeFiledEnum,
} from "../enums";
import { packageExportSchema } from "./exports";
import { fundingSchema } from "./funding";
import { personSchema } from "./person";

export const packageJsonTypeFiledZod = z
  .enum(packageJsonTypeFiledEnum)
  .describe(
    'When set to "module", the type field allows a package to specify all .js files within are ES modules. If the "type" field is omitted or set to "commonjs", all .js files are treated as CommonJS.'
  )
  .optional();

export const packageJsonSchema = z.object({
  name: z
    .string()
    .regex(
      new RegExp("^(?:@[a-z0-9-*~][a-z0-9-*._~]*/)?[a-z0-9-~][a-z0-9-._~]*$")
    )
    .min(1)
    .max(214)
    .describe("The name of the package."),
  version: z
    .string()
    .describe(
      "Version must be parseable by node-semver, which is bundled with npm as a dependency."
    )
    .optional(),
  description: z
    .string()
    .describe(
      "This helps people discover your package, as it's listed in 'npm search'."
    )
    .optional(),
  keywords: z
    .array(z.string())
    .describe(
      "This helps people discover your package as it's listed in 'npm search'."
    )
    .optional(),
  homepage: z.string().describe("The url to the project homepage.").optional(),
  bugs: z
    .union([
      z
        .object({
          url: z
            .string()
            .url()
            .describe("The url to your project's issue tracker.")
            .optional(),
          email: z
            .string()
            .email()
            .describe("The email address to which issues should be reported.")
            .optional(),
        })
        .describe(
          "The url to your project's issue tracker and / or the email address to which issues should be reported. These are helpful for people who encounter issues with your package."
        ),
      z
        .string()
        .describe(
          "The url to your project's issue tracker and / or the email address to which issues should be reported. These are helpful for people who encounter issues with your package."
        ),
    ])
    .describe(
      "The url to your project's issue tracker and / or the email address to which issues should be reported. These are helpful for people who encounter issues with your package."
    )
    .optional(),
  license: z
    .string()
    .describe(
      "You should specify a license for your package so that people know how they are permitted to use it, and any restrictions you're placing on it."
    ),
  licenses: z
    .array(
      z.object({
        type: z.string().optional(),
        url: z.string().url().optional(),
      })
    )
    .describe(
      'DEPRECATED: Instead, use SPDX expressions, like this: { "license": "ISC" } or { "license": "(MIT OR Apache-2.0)" } see: \'https://docs.npmjs.com/files/package.json#license\'.'
    )
    .optional(),
  author: personSchema.optional(),
  contributors: z
    .array(personSchema)
    .describe("A list of people who contributed to this package.")
    .optional(),
  maintainers: z
    .array(personSchema)
    .describe("A list of people who maintains this package.")
    .optional(),
  files: z
    .array(z.string())
    .describe(
      "The 'files' field is an array of files to include in your project. If you name a folder in the array, then it will also include the files inside that folder."
    )
    .optional(),
  main: z
    .string()
    .describe(
      "The main field is a module ID that is the primary entry point to your program."
    )
    .optional(),
  exports: packageExportSchema.optional(),
  bin: z.union([z.string(), z.record(z.string())]).optional(),
  type: packageJsonTypeFiledZod,
  types: z
    .string()
    .describe(
      "Set the types property to point to your bundled declaration file."
    )
    .optional(),
  typings: z
    .string()
    .describe(
      'Note that the "typings" field is synonymous with "types", and could be used as well.'
    )
    .optional(),
  typesVersions: z
    .record(
      z
        .object({
          "*": z
            .array(z.string().regex(new RegExp("^[^*]*(?:\\*[^*]*)?$")))
            .describe(
              "Maps all file paths to the file paths specified in the array."
            )
            .optional(),
        })
        .strict()
        .describe(
          "Contains overrides for the TypeScript version that matches the version range matching the property key."
        )
    )
    .describe(
      'The "typesVersions" field is used since TypeScript 3.1 to support features that were only made available in newer TypeScript versions.'
    )
    .optional(),
  man: z
    .union([
      z
        .array(z.string())
        .describe(
          "Specify either a single file or an array of filenames to put in place for the man program to find."
        ),
      z
        .string()
        .describe(
          "Specify either a single file or an array of filenames to put in place for the man program to find."
        ),
    ])
    .describe(
      "Specify either a single file or an array of filenames to put in place for the man program to find."
    )
    .optional(),
  directories: z
    .object({
      bin: z
        .string()
        .describe(
          "If you specify a 'bin' directory, then all the files in that folder will be used as the 'bin' hash."
        )
        .optional(),
      doc: z
        .string()
        .describe(
          "Put markdown files in here. Eventually, these will be displayed nicely, maybe, someday."
        )
        .optional(),
      example: z
        .string()
        .describe(
          "Put example scripts in here. Someday, it might be exposed in some clever way."
        )
        .optional(),
      lib: z
        .string()
        .describe(
          "Tell people where the bulk of your library is. Nothing special is done with the lib folder in any way, but it's useful meta info."
        )
        .optional(),
      man: z
        .string()
        .describe(
          "A folder that is full of man pages. Sugar to generate a 'man' array by walking the folder."
        )
        .optional(),
      test: z.string().optional(),
    })
    .optional(),
  repository: z
    .union([
      z
        .object({
          type: z.string().optional(),
          url: z.string().optional(),
          directory: z.string().optional(),
        })
        .describe(
          "Specify the place where your code lives. This is helpful for people who want to contribute."
        ),
      z
        .string()
        .describe(
          "Specify the place where your code lives. This is helpful for people who want to contribute."
        ),
    ])
    .describe(
      "Specify the place where your code lives. This is helpful for people who want to contribute."
    )
    .optional(),
  funding: fundingSchema.optional(),
  scripts: z.record(z.string()).optional(),
  config: z
    .record(z.unknown())
    .describe(
      "A 'config' hash can be used to set configuration parameters used in package scripts that persist across upgrades."
    )
    .optional(),
  dependencies: z.record(z.string()).optional(),
  devDependencies: z.record(z.string()).optional(),
  optionalDependencies: z.record(z.string()).optional(),
  peerDependencies: z.record(z.string()).optional(),
  peerDependenciesMeta: z
    .record(
      z
        .object({
          optional: z
            .boolean()
            .describe(
              "Specifies that this peer dependency is optional and should not be installed automatically."
            )
            .optional(),
        })
        .catchall(z.any())
    )
    .describe(
      'When a user installs your package, warnings are emitted if packages specified in "peerDependencies" are not already installed. The "peerDependenciesMeta" field serves to provide more information on how your peer dependencies are utilized. Most commonly, it allows peer dependencies to be marked as optional. Metadata for this field is specified with a simple hash of the package name to a metadata object.'
    )
    .optional(),
  bundledDependencies: z
    .union([z.string(), z.array(z.string())])
    .describe(
      "Array of package names that will be bundled when publishing the package."
    )
    .optional(),
  bundleDependencies: z
    .union([z.string(), z.array(z.string())])
    .describe(
      'DEPRECATED: This field is honored, but "bundledDependencies" is the correct field name.'
    )
    .optional(),
  resolutions: z
    .record(z.unknown())
    .describe(
      "Resolutions is used to support selective version resolutions, which lets you define custom package versions or ranges inside your dependencies. See: https://classic.yarnpkg.com/en/docs/selective-version-resolutions"
    )
    .optional(),
  packageManager: z
    .string()
    .regex(new RegExp("(npm|pnpm|yarn)@\\d+\\.\\d+\\.\\d+(-.+)?"))
    .describe(
      "Defines which package manager is expected to be used when working on the current project. This field is currently experimental and needs to be opted-in; see https://nodejs.org/api/corepack.html"
    )
    .optional(),
  engines: z
    .union([z.object({ node: z.string() }), z.record(z.string())])
    .optional(),
  engineStrict: z.boolean().optional(),
  os: z
    .array(z.string())
    .describe("Specify which operating systems your module will run on.")
    .optional(),
  cpu: z
    .array(z.string())
    .describe("Specify that your code only runs on certain cpu architectures.")
    .optional(),
  preferGlobal: z
    .boolean()
    .describe(
      "DEPRECATED: This option used to trigger an npm warning, but it will no longer warn. It is purely there for informational purposes. It is now recommended that you install any binaries as local devDependencies wherever possible."
    )
    .optional(),
  private: z
    .boolean()
    .describe("If set to true, then npm will refuse to publish it.")
    .optional(),
  publishConfig: z
    .object({
      access: z.enum(packageJsonPublishConfigAccessEnum).optional(),
      tag: z.string().optional(),
      registry: z.string().url().optional(),
    })
    .optional(),
  dist: z
    .object({ shasum: z.string().optional(), tarball: z.string().optional() })
    .optional(),
  readme: z.string().optional(),
  module: z
    .string()
    .describe(
      "An ECMAScript module ID that is the primary entry point to your program."
    )
    .optional(),
  esnext: z
    .union([
      z
        .string()
        .describe(
          "A module ID with untranspiled code that is the primary entry point to your program."
        ),
      z
        .object({ main: z.string().optional(), browser: z.string().optional() })
        .catchall(z.string())
        .describe(
          "A module ID with untranspiled code that is the primary entry point to your program."
        ),
    ])
    .describe(
      "A module ID with untranspiled code that is the primary entry point to your program."
    )
    .optional(),
  workspaces: z
    .array(z.string())
    .describe("Workspace package paths. Glob patterns are supported.")
    .optional(),
  jspm: z.unknown().optional(),
  eslintConfig: z.unknown().optional(),
  prettier: z.unknown().optional(),
  stylelint: z.unknown().optional(),
  ava: z.unknown().optional(),
  release: z.unknown().optional(),
});
