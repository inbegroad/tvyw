import { frameworksEnum, workspaceTypeEnum, repoTypeEnum } from "../schemas";
import { FrameworksType, WorkspaceType, RepoType } from "../types/from-schema";

export const getFromStringFramework = (
  str?: string
): FrameworksType | undefined => frameworksEnum.find((f) => f === str);

export const getFromStringWorkspaceType = (
  str?: string
): WorkspaceType | undefined => workspaceTypeEnum.find((f) => f === str);

// export const getFromStringWorkspaceStructure = (
//   str?: string
// ): WorkspaceStructure | undefined =>
//   workspaceStructureEnum.find((f) => f === str);
export const getFromStringRepoType = (str?: string): RepoType | undefined =>
  repoTypeEnum.find((f) => f === str);

export const getFramewrkFromString = (str?: string) => {
  const fw = getFromStringFramework(str);
  if (fw === undefined) throw new Error(`Framework ${str} not found`);
  return fw;
};
// export const getWorkspaceStructureFromString = (str?: string) => {
//   const wst = getFromStringWorkspaceStructure(str);
//   if (wst === undefined)
//     throw new Error(`Workspace structure ${str} not found`);
//   return wst;
// };

export const getWorkspaceTypeFromString = (str?: string) => {
  const wst = getFromStringWorkspaceType(str);
  if (wst === undefined) throw new Error(`Workspace type ${str} not found`);
  return wst;
};
export const getRepoTypeFromString = (str?: string) => {
  const repoType = getFromStringRepoType(str);
  if (repoType === undefined) throw new Error(`Repo type ${str} not found`);
  return repoType;
};
