import { sync, IOptions } from "glob";
import ts from "typescript";
import { WorkspaceDetailsType } from "../../tools/workspaces/types";

export function resolveTsconfigPath(workspace: WorkspaceDetailsType) {
  return ts.findConfigFile(
    workspace.location,
    ts.sys.fileExists,
    "tsconfig.json"
  );
}
