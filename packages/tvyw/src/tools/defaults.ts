import { TsconfigType } from "../types";
import { FrameworksType, WorkspaceType } from "../types/from-schema";

export type ConfigDefaultsType = {
  buildDir: string;
  entriesDir: string;
  testsDir: string;
  declarationDir: string;
  entries: string;
  framework: FrameworksType;
  // workspacesStructure: WorkspaceStructure;
  appsRootDir: string;
  packagesRootDir: string;
  workspaceType: WorkspaceType;
  extraExclude: string[];
  extraInclude: string[];
  extraWorkspaces: string[];
  typeSource: string;
  gitIgnore: string;
  npmIgnore: string;
  extraReferences: Required<TsconfigType["references"]>;
};
export const configDefaults: ConfigDefaultsType = {
  buildDir: "dist",
  entriesDir: "src",
  testsDir: "test",
  declarationDir: "types",
  entries: "index",
  framework: "vanilla",
  // workspacesStructure: "normal",
  appsRootDir: "apps",
  packagesRootDir: "packages",
  workspaceType: "app",
  extraReferences: [],
  extraExclude: [],
  extraInclude: [],
  extraWorkspaces: [],
  typeSource: "types",
  gitIgnore: "",
  npmIgnore: "",
};
