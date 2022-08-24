import { basename, parse } from "path";
import { readPackageJsonSync, readTsconfigSync } from "../read";
import { resolveConfig } from "../resolveProjMan";
import { getWorkspacesPath } from "./get-paths";
import { WorkspaceMapType } from "./types";

export const resolveConfigsFromProjects = () => {
  const paths = getWorkspacesPath();
  const configs: WorkspaceMapType = new Map();
  for (const pat of paths) {
    const packageJson = readPackageJsonSync(pat);
    const tsconfig = readTsconfigSync(pat);
    const projMan = resolveConfig(pat);
    let name = "";
    let isPackage: boolean | undefined = undefined;
    let noTs: boolean | undefined;
    let ketName = "root";
    if (projMan.repoType === "monoRepo") {
      if (projMan.root) {
        name = "root";
        isPackage = undefined;
      } else {
        name = projMan.packageName;
        isPackage = projMan.workspaceType === "package";
        noTs = projMan.disableTypescript;
        ketName = projMan.packageName;
      }
    } else {
      name = projMan.packageName;
      isPackage = projMan.workspaceType === "package";
      noTs = projMan.disableTypescript;
    }
    configs.set(ketName, {
      packageJson,
      tsconfig,
      rootDirName: pat === process.cwd() ? null : basename(parse(pat).dir),
      dirName: parse(pat).name,
      location: pat.replace(/\\/g, "/"),
      name,
      isPackage,
      projMan,
      disableTypescript: noTs || false,
    });
    // configs[pat] =;
  }
  return configs;
};
