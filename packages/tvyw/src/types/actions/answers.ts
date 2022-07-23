import { CommonQu } from "./props";

export type NewProjectAnswersType =
  | (Required<CommonQu> & {
      // install: boolean;
      root: string;
      repoType: "single";
    })
  | {
      repoType: "monoRepo";
      root: string;
      //  install: boolean
    };

export type AddWorkspaceAnswersType = { dirName: string } & CommonQu;
