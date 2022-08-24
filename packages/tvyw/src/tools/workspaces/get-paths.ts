import { existsSync, readdirSync } from "fs-extra";
import { join } from "path";
import { resolveConfig } from "../resolveProjMan";

export const getWorkspacesPath = () => {
  let workspaces: string[] = [];
  const projMan = resolveConfig();
  if (projMan.repoType === "monoRepo" && projMan.root) {
    const { extraWorkspaces, appsRootDir: app, packagesRootDir: pkg } = projMan;
    const extra = extraWorkspaces.map((ws) => join(process.cwd(), ws));
    const appsRootDir = join(process.cwd(), app);
    const packagesRootDir = join(process.cwd(), pkg);
    const packages = (
      existsSync(packagesRootDir) ? readdirSync(packagesRootDir) : []
    ).map((ws) => join(packagesRootDir, ws));
    const apps = (existsSync(appsRootDir) ? readdirSync(appsRootDir) : []).map(
      (ws) => join(appsRootDir, ws)
    );

    workspaces = [process.cwd()].concat(extra).concat(apps).concat(packages);
  } else {
    workspaces = [process.cwd()];
  }
  return workspaces;
};
