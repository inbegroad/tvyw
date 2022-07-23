import { join } from "path";
import { GetTemplateDirPropsType } from "./get-template-dir";

export const getTemplateProjMan = (props: GetTemplateDirPropsType) =>
  props.repoType === "monoRepo" && props.root
    ? join(__dirname, "..", "templates", "mono.txt")
    : join(__dirname, "..", "templates", "single.txt");
