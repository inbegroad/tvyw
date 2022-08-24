import { FrameworksType, TsconfigType, WorkspaceType } from "./from-schema";

export type { PackageJsonType, TsconfigType } from "./from-schema";
export type ProjManSingleEntrey = {
  packageName: string;
  buildDir?: string;
  declarationDir?: string;
  entries?: string;
  entriesDir?: string;
  extraInclude?: string[];
  extraExclude?: string[];
  extraReferences?: TsconfigType["references"];
  framework: FrameworksType;
  testsDir?: string;
  deploy?: boolean;
  workspaceType: WorkspaceType;
  disableTypescript?: boolean;
  typeSource?: string;
  gitIgnore?: string;
  npmIgnore?: string;
};

export type MonoRepoRootProjMan = {
  repoType: "monoRepo";
  root: true;
  packagesRootDir?: string;
  appsRootDir?: string;
  extraWorkspaces?: string[];
};

export type MonoRepoWorkspaceProjMan = {
  repoType: "monoRepo";
  root: false;
} & ProjManSingleEntrey;
export type SingleRepoProjMan = {
  repoType: "single";
  root: true;
} & ProjManSingleEntrey;

export type ProjManType =
  | MonoRepoRootProjMan
  | MonoRepoWorkspaceProjMan
  | SingleRepoProjMan;
