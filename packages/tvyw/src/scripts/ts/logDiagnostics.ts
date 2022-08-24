import ts from "typescript";
import { WorkspaceDetailsType } from "../../tools/workspaces/types";
import { createConsole } from "../console";

export function createDiagnostics(
  workspace: WorkspaceDetailsType,
  exits = false,
  isWatch = false
) {
  const formatHost: ts.FormatDiagnosticsHost = {
    getCanonicalFileName: (path) => path,
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    getNewLine: () => ts.sys.newLine,
  };

  const console = createConsole(
    workspace.name,
    isWatch ? "dev" : "build",
    workspace.projMan.repoType,
    undefined,
    "Types"
  );
  const newLine = formatHost.getNewLine();
  const singleDiagnostic = (diagnostic: ts.Diagnostic) => {
    const formatedDiagnostic = ts.formatDiagnosticsWithColorAndContext(
      [diagnostic],
      formatHost
    );
    const ignoredErrorCodes = [6231];
    if (!ignoredErrorCodes.includes(diagnostic.code)) {
      console.error(
        `Error ${diagnostic.code}: ${diagnostic.file?.fileName}${newLine}${formatedDiagnostic}`
      );
      exits && process.exit();
    }
  };
  return {
    formatHost,
    console,
    reportDiagnostic: (diagnostic: ts.Diagnostic | ts.Diagnostic[]) => {
      if (Array.isArray(diagnostic)) {
        for (const dia of diagnostic) {
          singleDiagnostic(dia);
        }
      } else singleDiagnostic(diagnostic);
    },
  };
}

export const loggerFinishMessage = (workspace: WorkspaceDetailsType) =>
  `Building${
    workspace.projMan.repoType === "monoRepo" ? ` ${workspace.name}` : ""
  } declarations finished !`;
export const loggerStartMessage = (workspace: WorkspaceDetailsType) =>
  `Start building${
    workspace.projMan.repoType === "monoRepo" ? ` on ${workspace.name}` : ""
  } declarations`;
