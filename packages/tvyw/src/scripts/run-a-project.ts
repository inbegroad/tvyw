import { emptyDirSync } from "fs-extra";
import { join } from "path";
import { preview, createServer, build } from "vite";
import { WorkspaceDetailsType } from "../tools/workspaces/types";
import { WorkspacesMap } from "../tools/workspaces/workspaces-map";
import { MonoRepoWorkspaceProjMan, SingleRepoProjMan } from "../types";
import { ProjManCmdType } from "../types/from-schema";
import { createCustomLogger } from "./logger";
import { printCommonServerUrls } from "./print-urls";
import { tsBuild } from "./ts/build";
import { tsWatch } from "./ts/watch";

export const runAProject = async (
  cmd: ProjManCmdType,
  name: string,
  workspaces: WorkspacesMap,
  isMono: boolean
) => {
  const workspace = isMono ? workspaces.findByName(name) : workspaces.getRoot();
  if (workspace) {
    isMono && process.chdir(workspace.location);
    const customLogger =
      workspaces.repoType === "monoRepo"
        ? createCustomLogger(name, cmd)
        : undefined;
    const { projMan, location } = workspace;

    if (!projMan.root || projMan.repoType === "single") {
      const mode = cmd === "build" ? "production" : "development";
      const configFile = join(location, "vite.config.ts");

      switch (projMan.workspaceType) {
        case "package": {
          switch (cmd) {
            case "dev":
            case "build": {
              buildTypes(workspace, cmd, projMan);
              await build({ configFile, mode, customLogger });
              break;
            }
            default: {
              break;
            }
          }

          break;
        }
        case "app": {
          switch (cmd) {
            case "build": {
              await build({ configFile, mode, customLogger });
              break;
            }
            case "dev": {
              const server = await createServer({
                configFile,
                mode,
                customLogger,
              });
              await server.listen();
              printCommonServerUrls(
                server.httpServer,
                server.config.server,
                server.config
              );
              break;
            }
            case "preview": {
              const server = await preview({
                preview: {
                  port: 8080,
                  open: true,
                },
              });
              printCommonServerUrls(
                server.httpServer,
                server.config.server,
                server.config
              );
              break;
            }
            default: {
              break;
            }
          }
          break;
        }
      }
    }
  }
};

function buildTypes(
  workspace: WorkspaceDetailsType,
  cmd: ProjManCmdType,
  projMan: Required<MonoRepoWorkspaceProjMan> | Required<SingleRepoProjMan>
) {
  emptyDirSync(join(workspace.location, projMan.declarationDir));
  runTypesctiptComp(workspace, cmd === "dev");
}

function runTypesctiptComp(workspace: WorkspaceDetailsType, dev: boolean) {
  if (dev) {
    tsWatch(workspace);
  } else {
    tsBuild(workspace);
  }
}
