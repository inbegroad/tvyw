import ts from "typescript";
import { WorkspaceDetailsType } from "../../tools/workspaces/types";
import {
  createDiagnostics,
  loggerFinishMessage,
  loggerStartMessage,
} from "./logDiagnostics";
import { resolveConfig } from "./resolveConfig";

export function tsBuild(workspace: WorkspaceDetailsType): void {
  const { files: fileNames, options } = resolveConfig(workspace);
  const { reportDiagnostic, console } = createDiagnostics(workspace, true);
  console.info(loggerStartMessage(workspace));

  const program = ts.createProgram(fileNames, options);
  const emitResult = program.emit();

  const allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);
  reportDiagnostic(allDiagnostics);

  console.info(loggerFinishMessage(workspace));
}
