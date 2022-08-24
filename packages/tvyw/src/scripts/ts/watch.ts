import ts from "typescript";
import { WorkspaceDetailsType } from "../../tools/workspaces/types";
import { createConsole } from "../console";
import {
  createDiagnostics,
  loggerFinishMessage,
  loggerStartMessage,
} from "./logDiagnostics";
import { resolveTsconfigPath } from "./resolveConfigPath";

export function tsWatch(workspace: WorkspaceDetailsType) {
  const console = createConsole(
    workspace.name,
    "dev",
    workspace.projMan.repoType,
    undefined,
    "Types"
  );
  const configPath = resolveTsconfigPath(workspace);
  const { reportDiagnostic } = createDiagnostics(workspace);

  if (!configPath) {
    throw new Error("Could not find a valid 'tsconfig.json'.");
  }

  const createProgram = ts.createSemanticDiagnosticsBuilderProgram;

  const host = ts.createWatchCompilerHost(
    configPath,
    {},
    ts.sys,
    createProgram,
    reportDiagnostic
  );

  const origCreateProgram = host.createProgram;
  //@ts-ignore
  host.createProgram = (
    rootNames: ReadonlyArray<string>,
    options,
    host,
    oldProgram
  ) => {
    console.info(loggerStartMessage(workspace));
    return origCreateProgram(rootNames, options, host, oldProgram);
  };
  const origPostProgramCreate = host.afterProgramCreate;

  host.afterProgramCreate = (program) => {
    console.info(loggerFinishMessage(workspace));
    origPostProgramCreate?.(program);
  };

  ts.createWatchProgram(host);
}
