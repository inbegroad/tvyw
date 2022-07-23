import { z } from "zod";
import {
  tsconfigFallbackPollingEnum,
  tsconfigImportsNotUsedAsValuesEnum,
  tsconfigJsxEnum,
  tsconfigLibEnum,
  tsconfigModuleEnum,
  tsconfigmoduleResolutionEnum,
  tsconfigNewLineEnum,
  tsconfigTargetEnum,
  tsconfigWatchDirectoryEnum,
  tsconfigWatchFileEnum,
} from "./enums";

export const tsconfigSchema = z.object({
  desplay: z.string().optional(),
  buildOptions: z
    .object({
      assumeChangesOnlyAffectDirectDependencies: z.boolean().optional(),
      dry: z.boolean().optional(),
      force: z.boolean().optional(),
      incremental: z.boolean().optional(),
      traceResolution: z.boolean().optional(),
      verbose: z.boolean().optional(),
    })
    .optional(),
  compileOnSave: z.boolean().optional(),
  compilerOptions: z
    .object({
      allowJs: z.boolean().optional(),
      allowSyntheticDefaultImports: z.boolean().optional(),
      allowUmdGlobalAccess: z.boolean().optional(),
      allowUnreachableCode: z.boolean().optional(),
      allowUnusedLabels: z.boolean().optional(),
      alwaysStrict: z.boolean().optional(),
      assumeChangesOnlyAffectDirectDependencies: z.boolean().optional(),
      baseUrl: z.string().optional(),
      charset: z.string().optional(),
      checkJs: z.boolean().optional(),
      composite: z.boolean().optional(),
      declaration: z.boolean().optional(),
      declarationDir: z.union([z.null(), z.string()]).optional(),
      declarationMap: z.boolean().optional(),
      diagnostics: z.boolean().optional(),
      disableReferencedProjectLoad: z.boolean().optional(),
      disableSizeLimit: z.boolean().optional(),
      disableSolutionSearching: z.boolean().optional(),
      disableSourceOfProjectReferenceRedirect: z.boolean().optional(),
      downlevelIteration: z.boolean().optional(),
      emitBOM: z.boolean().optional(),
      emitDeclarationOnly: z.boolean().optional(),
      emitDecoratorMetadata: z.boolean().optional(),
      esModuleInterop: z.boolean().optional(),
      exactOptionalPropertyTypes: z.boolean().optional(),
      experimentalDecorators: z.boolean().optional(),
      extendedDiagnostics: z.boolean().optional(),
      fallbackPolling: z.enum(tsconfigFallbackPollingEnum).optional(),
      forceConsistentCasingInFileNames: z.boolean().optional(),
      generateCpuProfile: z.string().optional(),
      importHelpers: z.boolean().optional(),
      importsNotUsedAsValues: z
        .enum(tsconfigImportsNotUsedAsValuesEnum)
        .optional(),
      incremental: z.boolean().optional(),
      inlineSourceMap: z.boolean().optional(),
      inlineSources: z.boolean().optional(),
      isolatedModules: z.boolean().optional(),
      jsx: z.enum(tsconfigJsxEnum).optional(),
      jsxFactory: z.string().optional(),
      jsxFragmentFactory: z.string().optional(),
      jsxImportSource: z.string().optional(),
      keyofStringsOnly: z.boolean().optional(),
      lib: z.enum(tsconfigLibEnum).optional(),
      listEmittedFiles: z.boolean().optional(),
      listFiles: z.boolean().optional(),
      listFilesOnly: z.boolean().optional(),
      mapRoot: z.string().optional(),
      maxNodeModuleJsDepth: z.number().optional(),
      module: z.enum(tsconfigModuleEnum).optional(),
      moduleResolution: z.enum(tsconfigmoduleResolutionEnum).optional(),
      newLine: z.enum(tsconfigNewLineEnum).optional(),
      noEmit: z.boolean().optional(),
      noEmitHelpers: z.boolean().optional(),
      noEmitOnError: z.boolean().optional(),
      noErrorTruncation: z.boolean().optional(),
      noFallthroughCasesInSwitch: z.boolean().optional(),
      noImplicitAny: z.boolean().optional(),
      noImplicitOverride: z.boolean().optional(),
      noImplicitReturns: z.boolean().optional(),
      noImplicitThis: z.boolean().optional(),
      noImplicitUseStrict: z.boolean().optional(),
      noLib: z.boolean().optional(),
      noPropertyAccessFromIndexSignature: z.boolean().optional(),
      noResolve: z.boolean().optional(),
      noStrictGenericChecks: z.boolean().optional(),
      noUncheckedIndexedAccess: z.boolean().optional(),
      noUnusedLocals: z.boolean().optional(),
      noUnusedParameters: z.boolean().optional(),
      outDir: z.string().optional(),
      outFile: z.string().optional(),
      paths: z.record(z.array(z.string())).optional(),
      plugins: z.array(z.object({ name: z.string().optional() })).optional(),
      preserveConstEnums: z.boolean().optional(),
      preserveSymlinks: z.boolean().optional(),
      preserveValueImports: z.boolean().optional(),
      preserveWatchOutput: z.boolean().optional(),
      pretty: z.boolean().optional(),
      reactNamespace: z.string().optional(),
      removeComments: z.boolean().optional(),
      resolveJsonModule: z.boolean().optional(),
      rootDir: z.string().optional(),
      rootDirs: z.array(z.string()).optional(),
      skipDefaultLibCheck: z.boolean().optional(),
      skipLibCheck: z.boolean().optional(),
      sourceMap: z.boolean().optional(),
      sourceRoot: z.string().optional(),
      strict: z.boolean().optional(),
      strictBindCallApply: z.boolean().optional(),
      strictFunctionTypes: z.boolean().optional(),
      strictNullChecks: z.boolean().optional(),
      strictPropertyInitialization: z.boolean().optional(),
      stripInternal: z.boolean().optional(),
      suppressExcessPropertyErrors: z.boolean().optional(),
      suppressImplicitAnyIndexErrors: z.boolean().optional(),
      target: z.enum(tsconfigTargetEnum).optional(),
      traceResolution: z.boolean().optional(),
      tsBuildInfoFile: z.string().optional(),
      typeRoots: z.array(z.string()).optional(),
      types: z.array(z.string()).optional(),
      useDefineForClassFields: z.boolean().optional(),
      useUnknownInCatchVariables: z.boolean().optional(),
      watch: z.boolean().optional(),
      watchDirectory: z.enum(tsconfigWatchDirectoryEnum).optional(),
      watchFile: z.enum(tsconfigWatchFileEnum).optional(),
    })
    .optional(),
  exclude: z.array(z.string()).optional(),
  extends: z.string().optional(),
  files: z.array(z.string()).optional(),
  include: z.array(z.string()).optional(),
  references: z
    .array(z.object({ path: z.string(), circular: z.boolean().optional() }))
    .optional(),
  typeAcquisition: z
    .object({
      enable: z.boolean().optional(),
      exclude: z.array(z.string()).optional(),
      include: z.array(z.string()).optional(),
    })
    .optional(),
  watchOptions: z
    .object({
      excludeDirectories: z.array(z.string()).optional(),
      excludeFiles: z.array(z.string()).optional(),
      fallbackPolling: z.string().optional(),
      force: z.string().optional(),
      synchronousWatchDirectory: z.boolean().optional(),
      watchDirectory: z.string().optional(),
      watchFile: z.string().optional(),
    })
    .optional(),
});
