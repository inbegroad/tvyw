import { PackageJsonType, TsconfigType, ProjManType } from "../../types";
import { RepoType } from "../../types/from-schema";
import { RootMap } from "./root-map";

export type WorkspaceDetailsType = {
  packageJson: PackageJsonType;
  tsconfig?: TsconfigType;
  dirName: string;
  location: string;
  rootDirName: string | null;
  projMan: Required<ProjManType>;
  name: string;
  isPackage?: boolean;
  disableTypescript: boolean;
};
export type WorkspaceMapType = RootMap<WorkspaceDetailsType>;
export type ConfigFiles = {
  packageJson: PackageJsonType;
  tsconfig?: TsconfigType;
  projMan: ProjManType;
};
export interface IWorkspace {
  size: number;
  workspacesList: WorkspaceDetailsType[];
  repoType: RepoType;
  root: WorkspaceDetailsType;
  findByName: (name: string) => WorkspaceDetailsType | undefined;
  findByLocation: (location: string) => WorkspaceDetailsType | undefined;
  getLocationByName: (name: string) => string | undefined;
  isSameLocation: (anyLocation: string, distLocation: string) => boolean;
  isWorkspace: (name: string) => boolean;
  isAvailableName: (name: string) => boolean;
  getConfigFiles: (name: string) => ConfigFiles;
  isAvailableLocation: (location: string) => boolean;
  isDependenciesWorkspace: (deps: PackageJsonType["dependencies"]) => string[];
}
export type BuildsType = {
  vite: boolean;
  types: boolean;
};
export type ExcutionQueueType = Map<string, BuildsType>;
