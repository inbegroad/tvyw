import { z } from "zod";

export const packageJsonPublishConfigAccessEnum = [
  "public",
  "restricted",
] as const;

export const packageJsonTypeFiledEnum = ["commonjs", "module"] as const;
export const frameworksEnum = [
  "custom",
  "express",
  "preact",
  "react",
  "svelte",
  "vanilla",
  "vue",
] as const;
export const isPackagableEnum = [
  "custom",
  "react",
  "vanilla",
  "express",
] as const;
export const canWebAppEnum = [
  "custom",
  "preact",
  "react",
  "svelte",
  "vanilla",
  "vue",
] as const;
export const repoTypeEnum = ["monoRepo", "single"] as const;

export const workspaceStructureEnum = ["scripts", "normal"] as const;
export const workspaceTypeEnum = ["app", "package"] as const;
export const projManCmdEnum = [
  "build",
  "dev",
  "lint",
  "test",
  "scaf",
  "preview",
  "start",
] as const;

export const nodeModulesEnum = [
  "assert",
  "buffer",
  "child_process",
  "console",
  "cluster",
  "crypto",
  "dgram",
  "dns",
  "events",
  "fs",
  "http",
  "http2",
  "https",
  "net",
  "os",
  "path",
  "perf_hooks",
  "process",
  "querystring",
  "readline",
  "repl",
  "stream",
  "string_decoder",
  "timers",
  "tls",
  "tty",
  "url",
  "util",
  "v8",
  "vm",
  "wasi",
  "worker",
  "zlib",
];
export const frameworksZod = z.enum(frameworksEnum);
export const projManCmdZod = z.enum(projManCmdEnum);
export const repoTypeZod = z.enum(repoTypeEnum);
export const workspaceStructureZod = z.enum(workspaceStructureEnum);
export const workspaceTypeZod = z.enum(workspaceTypeEnum);
export const tsconfigTargetEnum = [
  "ES2015",
  "ES2016",
  "ES2017",
  "ES2018",
  "ES2019",
  "ES2020",
  "ES2021",
  "ES2022",
  "ES3",
  "ES5",
  "ES6",
  "ESNext",
] as const;

export const tsconfigWatchDirectoryEnum = [
  "dynamicPriorityPolling",
  "fixedChunkSizePolling",
  "fixedPollingInterval",
  "useFsEvents",
] as const;

export const tsconfigWatchFileEnum = [
  "dynamicPriorityPolling",
  "fixedChunkSizePolling",
  "fixedPollingInterval",
  "priorityPollingInterval",
  "useFsEvents",
  "useFsEventsOnParentDirectory",
] as const;

export const tsconfigFallbackPollingEnum = [
  "dynamicPriority",
  "dynamicPriorityPolling",
  "fixedChunkSize",
  "fixedInterval",
  "fixedPollingInterval",
  "priorityInterval",
  "priorityPollingInterval",
] as const;
export const tsconfigImportsNotUsedAsValuesEnum = [
  "error",
  "preserve",
  "remove",
] as const;
export const tsconfigJsxEnum = [
  "preserve",
  "react",
  "react-jsx",
  "react-jsxdev",
  "react-native",
] as const;
export const tsconfigLibEnum = [
  "DOM",
  "DOM.Iterable",
  "ES2015",
  "ES2015.Collection",
  "ES2015.Core",
  "ES2015.Generator",
  "ES2015.Iterable",
  "ES2015.Promise",
  "ES2015.Proxy",
  "ES2015.Reflect",
  "ES2015.Symbol",
  "ES2015.Symbol.WellKnown",
  "ES2016",
  "ES2016.Array.Include",
  "ES2017",
  "ES2017.Intl",
  "ES2017.Object",
  "ES2017.SharedMemory",
  "ES2017.String",
  "ES2017.TypedArrays",
  "ES2018",
  "ES2018.AsyncGenerator",
  "ES2018.AsyncIterable",
  "ES2018.Intl",
  "ES2018.Promise",
  "ES2018.Regexp",
  "ES2019",
  "ES2019.Array",
  "ES2019.Object",
  "ES2019.String",
  "ES2019.Symbol",
  "ES2020",
  "ES2020.BigInt",
  "ES2020.Intl",
  "ES2020.Promise",
  "ES2020.SharedMemory",
  "ES2020.String",
  "ES2020.Symbol.WellKnown",
  "ES2021",
  "ES2021.Promise",
  "ES2021.String",
  "ES2021.WeakRef",
  "ES5",
  "ES6",
  "ES7",
  "ESNext",
  "ESNext.Array",
  "ESNext.AsyncIterable",
  "ESNext.BigInt",
  "ESNext.Intl",
  "ESNext.Promise",
  "ESNext.String",
  "ESNext.Symbol",
  "ESNext.WeakRef",
  "ScriptHost",
  "WebWorker",
  "WebWorker.ImportScripts",
  "Webworker.Iterable",
  "es2021.intl",
] as const;
export const tsconfigModuleEnum = [
  "AMD",
  "CommonJS",
  "ES2015",
  "ES2020",
  "ES2022",
  "ES6",
  "ESNext",
  "Node12",
  "NodeNext",
  "None",
  "System",
  "UMD",
] as const;
export const tsconfigmoduleResolutionEnum = [
  "Classic",
  "Node",
  "Node12",
  "NodeNext",
] as const;
export const tsconfigNewLineEnum = ["crlf", "lf"] as const;
