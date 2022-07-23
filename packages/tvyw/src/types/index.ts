import { FrameworksType, TsconfigType, WorkspaceType } from "./from-schema";

export type { PackageJsonType, TsconfigType } from "./from-schema";
type ProjManVal = {
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

export type ProjManType =
  | {
      repoType: "monoRepo";
      root: true;
      packagesRootDir?: string;
      appsRootDir?: string;
      extraWorkspaces?: string[];
    }
  | ({ repoType: "monoRepo"; root: false } & ProjManVal)
  | ({ repoType: "single"; root: true } & ProjManVal);
