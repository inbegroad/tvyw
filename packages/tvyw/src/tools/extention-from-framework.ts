import { FrameworksType, WorkspaceType } from "../types/from-schema";

export const getEntryExtentionFromFramework = (
  framework: FrameworksType,
  workspaceType: WorkspaceType = "app"
): string => {
  switch (framework) {
    case "preact":
      return workspaceType === "app" ? "tsx" : "ts";
    case "react":
      return workspaceType === "app" ? "tsx" : "ts";
    case "svelte":
      return "ts";
    case "vanilla":
      return "ts";
    case "vue":
      return "ts";
    case "express":
      return "ts";
    default:
      return workspaceType === "app" ? "ts" : "ts";
  }
};
