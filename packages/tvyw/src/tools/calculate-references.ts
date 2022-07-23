import { ProjManType, TsconfigType } from "../types";
import { FrameworksType } from "../types/from-schema";
import { refPackages } from "./relative-packages";
import { findWorkspaceByName, WorkspacesListType } from "./workspaces-list";

export type CalculateRefrencesType = (
  projMan: ProjManType,
  workspaces: WorkspacesListType
) => TsconfigType["references"];

type Extras = Record<FrameworksType, TsconfigType["references"]>;

const getExtras = (fw: FrameworksType, ext: TsconfigType["references"]) => {
  const ex: Extras = {
    custom: undefined,
    express: undefined,
    preact: [{ path: "./tsconfig.node.json" }],
    react: undefined,
    svelte: [{ path: "./tsconfig.node.json" }],
    vanilla: undefined,
    vue: [{ path: "./tsconfig.node.json" }],
  };
  if (ext) {
    if (ext.length === 0) return ex[fw];
    else return ext.concat(ex[fw] || []);
  } else {
    return ex[fw];
  }
};
export const calculateReferences: CalculateRefrencesType = (
  projMan,
  workspaces
) => {
  if (projMan.repoType === "monoRepo" && projMan.root) {
    return workspaces?.workspaces
      .filter((w) => !w.disableTypescript)
      .map(({ location: lk }) => ({
        path: lk,
      }));
  } else if (projMan.repoType === "monoRepo" && !projMan.root) {
    const refs = getExtras(projMan.framework, projMan.extraReferences) || [];
    const wsf = workspaces.workspaces
      .filter((ws) => ws.name !== projMan.packageName)
      .filter(({ isPackage }) => isPackage)
      .filter((w) => !w.disableTypescript);
    const curr = findWorkspaceByName(projMan.packageName, workspaces);
    if (curr !== undefined)
      return refs.concat(
        wsf.map((w) => ({
          path:
            projMan.workspaceType === "package"
              ? `../${w.dirName}`
              : refPackages(curr.location, w.location),
          circular: projMan.workspaceType === "package" ? true : undefined,
        }))
      );
  }
};
