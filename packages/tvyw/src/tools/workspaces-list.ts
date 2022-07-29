import { execSync } from "child_process";
import { ndjsonToJsonText } from "ndjson-to-json-text";
import path from "path";
import appRootPath from "app-root-path";
import { PackageJsonType, ProjManType, TsconfigType } from "../types";
import { readPackageJsonSync, readTsconfigSync } from "./read";
import { resolveConfig } from "./resolveProjMan";

type CliOut = { name: string; location: string };
type Raw = {
  fullPath: string;
  destPath: string;
  appRootPath: string;
} & CliOut;
export type WorkspaceDetailsType = {
  packageJson: PackageJsonType;
  projMan: Required<ProjManType>;
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
export const getWorkspacesListRaw = () => {
  const out = execSync("yarn workspaces list --json -R").toString().trim();

  const raw = JSON.parse(ndjsonToJsonText(out)) as CliOut[];

  return raw.map(({ location, name }) => {
    const rootPath = appRootPath.path.replace(/\\/g, "/");
    const fullPath = path.join(rootPath, location).replace(/\\/g, "/");
    const destPath = path.relative(process.cwd(), fullPath).replace(/\\/g, "/");
    return { name, location, fullPath, destPath, appRootPath: rootPath };
  }) as Raw[];
};

export const getWorkspacesList = (): WorkspacesListType => {
  const raw = getWorkspacesListRaw();
  const detailedRaw = raw.map<WorkspaceDetailsType>(
    ({ destPath, fullPath, location, name, appRootPath }) => {
      const projMan = resolveConfig(fullPath);

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
        name,
        location,
        appRootPath,
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
          location === "."
            ? null
            : path.relative(appRootPath, path.join(fullPath, "../")),
      };
    }
  );
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

export const isWorkspaceDep = (dependencies: Record<string, string> = {}) => {
  const wss = getWorkspacesListRaw();
  let ret: Record<string, boolean> = {};

  for (const ws of Object.keys(dependencies)) {
    const found = wss.find((w) => w.name === ws);
    ret = { ...ret, [ws]: found !== undefined };
  }

  return Object.keys(ret).filter((re) => ret[re] === true);
};

export const getWorkspaceLocation = (name: string, raw?: Raw[]) =>
  (raw || getWorkspacesListRaw()).filter((w) => w.name === name)[0].location;
export const isAvailableWorkspaceName = (name: string, raw?: Raw[]) =>
  (raw || getWorkspacesListRaw()).find((r) => r.name === name) === undefined;
export const isAvailableWorkspaceLocation = (location: string, raw?: Raw[]) =>
  (raw || getWorkspacesListRaw()).find((r) => r.location === location) ===
  undefined;

export const isWorkspace = (name: string, raw?: Raw[]) =>
  !isAvailableWorkspaceName(name, raw);
export const isWorkspaceByLocation = (location: string, raw?: Raw[]) =>
  !isAvailableWorkspaceLocation(location, raw);
