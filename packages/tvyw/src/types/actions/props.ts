import { ProjManLooseType } from "../from-schema";

export type CommonQu = Pick<
  ProjManLooseType,
  | "framework"
  // | "workspaceStructure"
  | "workspaceType"
  | "packageName"
>;
export type AddWorkspacePropsType = Omit<CommonQu, "packageName">;
export type NewProjectPropsType = Partial<CommonQu> &
  Partial<
    Pick<ProjManLooseType, "repoType"> & {
      install?: boolean;
      overwrite?: boolean;
    }
  >;
