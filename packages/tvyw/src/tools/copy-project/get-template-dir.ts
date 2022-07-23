import path from "path";
import { FrameworksType } from "../../types/from-schema";

export type GetTemplateDirPropsType =
  | {
      repoType: "single";
      framework: FrameworksType;
    }
  | {
      repoType: "monoRepo";
      root: true;
    }
  | {
      repoType: "monoRepo";
      root: false;
      framework: FrameworksType;
    };
export type GetTemplateDirType = (props: GetTemplateDirPropsType) => string;
export const getTemplateDir: GetTemplateDirType = (props) =>
  props.repoType === "monoRepo" && props.root
    ? path.join(__dirname, "..", "templates", "mono")
    : path.join(__dirname, "..", "templates", "single", props.framework);
