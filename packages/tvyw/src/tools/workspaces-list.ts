import { execSync } from "child_process";
import { ndjsonToJsonText } from "ndjson-to-json-text";
import path from "path";
import appRootPath from "app-root-path";
import { PackageJsonType, ProjManType, TsconfigType } from "../types";
import { readPackageJsonSync, readTsconfigSync } from "./read";
import { resolveConfig } from "./resolveProjMan";

type Raw = {
  name: string;
  location: string;
};
export type WorkspaceDetailsType = {
  fullPath: string;
  destPath: string;
  packageJson: PackageJsonType;
  projMan: ProjManType;
  tsconfig?: TsconfigType;
  dirName: string;
  rootDirName: string | null;
  isPackage: boolean;
  deploy: boolean;
  disableTypescript: boolean;
} & Raw;

export type WorkspacesListType = {
  root: WorkspaceDetailsType;
  workspaces: WorkspaceDetailsType[];
};
const getRaw = () => {
  const out = execSync("yarn workspaces list --json -R").toString().trim();

  const raw = JSON.parse(ndjsonToJsonText(out)) as Raw[];
  return raw;
};

export const getWorkspacesList = (noProjMan = false): WorkspacesListType => {
  const scriptPath = process.cwd();
  const raw = getRaw();
  const rootPath = appRootPath.path.replace(/\\/g, "/");
  const detailedRaw = raw.map<WorkspaceDetailsType>((r) => {
    const fullPath = path.join(rootPath, r.location).replace(/\\/g, "/");
    const destPath = path.relative(scriptPath, fullPath).replace(/\\/g, "/");
    let projMan: ProjManType = {
      repoType: "monoRepo",
      root: true,
    };
    if (!noProjMan) projMan = resolveConfig(fullPath);
    let tsconfig: TsconfigType = {};
    let disableTypescript = false;
    let isPackage = false;
    let deploy = false;
    if (
      (projMan.repoType === "monoRepo" && !projMan.root) ||
      projMan.repoType === "single"
    ) {
      isPackage = projMan.workspaceType === "package";
      deploy = projMan.deploy || false;
      if (!projMan.disableTypescript) {
        tsconfig = readTsconfigSync(fullPath) || {};
      } else {
        disableTypescript = true;
      }
    }
    return {
      ...r,
      fullPath,
      destPath,
      projMan,
      tsconfig,
      isPackage,
      disableTypescript,
      packageJson: readPackageJsonSync(fullPath),
      dirName: path.parse(fullPath).name,
      deploy,
      rootDirName:
        r.location === "."
          ? null
          : path.relative(rootPath, path.join(fullPath, "../")),
    };
  });
  const root = detailedRaw.filter((r) => r.location === ".")[0];
  const workspaces = detailedRaw.filter((r) => r.location !== ".");

  return { root, workspaces };
};
export const findWorkspaceByName = (
  name: string,
  workspaces?: WorkspacesListType
) => {
  const { root, workspaces: wss } = workspaces || getWorkspacesList();
  if (name === "root" || name === root.name) return root;
  return wss.find((w) => w.name === name);
};
export const isSameLocation = (anyLocation: string, distLocation: string) => {
  const loc = path.parse(anyLocation);
  const loca = path.join(loc.dir.replace(/\\/g, "/"), loc.name);
  const locSrc = path.parse(distLocation);
  const locaSrc = path.join(loc.dir.replace(/\\/g, "/"), locSrc.name);
  return loca === locaSrc;
};
export const findWorkspaceLocation = (
  location: string,
  workspaces?: WorkspacesListType
) => {
  const { root, workspaces: wss } = workspaces || getWorkspacesList();
  if (location === "." || isSameLocation(location, root.location)) return root;
  return wss.find((w) => isSameLocation(location, w.location));
};

export const isWorkspaceDep = (
  dependencies: Record<string, string> = {},
  workspaces?: WorkspacesListType
) => {
  const { workspaces: wss } = workspaces || getWorkspacesList();
  let ret: Record<string, boolean> = {};

  for (const ws of Object.keys(dependencies)) {
    const found = wss.find((w) => w.name === ws);
    ret = { ...ret, [ws]: found !== undefined };
  }

  return Object.keys(ret).filter((re) => ret[re] === true);
};
export const isAvailableWorkspaceName = (name: string) =>
  getRaw().find((r) => r.name === name) === undefined;

export const isWorkspace = (name: string) => !isAvailableWorkspaceName(name);
