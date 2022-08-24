import { FrameworksType, TsconfigType } from "../types/from-schema";
import { relativePackages } from "./relative";
import { WorkspacesMap } from "./workspaces/workspaces-map";

export type CalculateRefrencesType = (
  name: string,
  workspaces: WorkspacesMap
) => TsconfigType["references"];

type Extras = Record<FrameworksType, TsconfigType["references"]>;

const getExtras = (fw: FrameworksType, ext: TsconfigType["references"]) => {
  const ex: Extras = {
    custom: undefined,
    // express: undefined,
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
  name,
  workspaces
) => {
  let ret: TsconfigType["references"];
  const workspace = workspaces.findByName(name);

  if (workspace && !workspace.disableTypescript) {
    if (workspace.projMan.repoType === "monoRepo") {
      if (workspace.projMan.root) {
        const refs = workspaces.workspacesList
          .filter((w) => !w.disableTypescript)
          .map((w) => ({
            path: relativePackages(workspace.location, w.location),
          }));

        ret = refs;
      } else {
        const refs = workspaces.workspacesList
          .filter(
            (w) =>
              !w.disableTypescript &&
              w.name !== workspace.name &&
              w.isPackage &&
              workspaces.isDependencyOf(w.name, workspace.name)
          )
          .map((w) => ({
            path: relativePackages(workspace.location, w.location),
          }))
          .concat(
            getExtras(
              workspace.projMan.framework,
              workspace.projMan.extraReferences
            ) || []
          );

        ret = refs;
      }
    } else {
      ret = getExtras(
        workspace.projMan.framework,
        workspace.projMan.extraReferences
      );
    }
  }

  return ret?.length === 0 ? undefined : ret;
};
