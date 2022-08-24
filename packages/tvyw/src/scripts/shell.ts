import { WorkspaceDetailsType } from "../tools/workspaces/types";
import { createConsole } from "./console";
import shelljs from "shelljs.exec";
import { ProjManCmdType } from "../types/from-schema";

export const shell = (
  cmd: string,
  workspace: WorkspaceDetailsType,
  projectCmd?: ProjManCmdType
) => {
  const console = createConsole(
    workspace.name,
    projectCmd || "build",
    workspace.projMan.repoType,
    projectCmd === undefined
  );
  const { error, stderr, stdout } = shelljs(cmd, {
    cwd: workspace.location,
    encoding: "utf-8",
  });
  if (error) {
    console.error(stderr);
  } else {
    console.log(stdout);
  }
};
