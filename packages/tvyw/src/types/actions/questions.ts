import { ProjManLooseType } from "../from-schema";
import { NewProjectAnswersType, AddWorkspaceAnswersType } from "./answers";
import { NewProjectPropsType } from "./props";

export type NewProjectQuestionType = (
  targetDir: string,
  kwargs: NewProjectPropsType
) => Promise<NewProjectAnswersType>;
export type AddWorkspaceQuestionType = (
  name: string | undefined,

  kwargs: Partial<
    Pick<
      ProjManLooseType,
      | "framework"
      //  | "workspaceStructure"
      | "workspaceType"
      // | "packageName"
    >
  >
) => Promise<AddWorkspaceAnswersType>;
