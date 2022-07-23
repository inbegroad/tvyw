export * from "./answers";
export * from "./props";
export * from "./questions";

import { AddWorkspacePropsType, NewProjectPropsType } from "./props";

export type NewProjectActionType = (
  targetDir: string,
  kwargs: NewProjectPropsType
) => Promise<void>;

export type AddWorkspaceActionType = (
  dirName: string,
  kwargs: AddWorkspacePropsType
) => Promise<void>;
