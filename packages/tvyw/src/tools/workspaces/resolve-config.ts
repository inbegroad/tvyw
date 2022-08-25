import { basename, parse } from "path";
import { readPackageJsonSync, readTsconfigSync } from "../read";
import { resolveConfig } from "../resolveProjMan";
import { getWorkspacesPath } from "./get-paths";
import { RootMap } from "./root-map";
import { WorkspaceMapType } from "./types";

export const resolveConfigsFromProjects = () => {
  const paths = getWorkspacesPath();
  const configs: WorkspaceMapType = new RootMap();
  let name = "";
  let isPackage: boolean | undefined = undefined;
  let noTs: boolean | undefined;
  for (const path of paths) {
    const packageJson = readPackageJsonSync(path);
    const tsconfig = readTsconfigSync(path);
    const projMan = resolveConfig(path);
    if (projMan.repoType === "single") {
      configs.setRoot({
        packageJson,
        tsconfig,
        rootDirName: null,
        dirName: parse(path).name,
        location: path.replace(/\\/g, "/"),
        name,
        isPackage,
        projMan,
        disableTypescript: noTs || false,
      });
    } else {
      if (!projMan.root) {
        name = projMan.packageName;
        isPackage = projMan.workspaceType === "package";
        noTs = projMan.disableTypescript;
        configs.set(name, {
          packageJson,
          tsconfig,
          rootDirName:
            path === process.cwd() ? null : basename(parse(path).dir),
          dirName: parse(path).name,
          location: path.replace(/\\/g, "/"),
          name,
          isPackage,
          projMan,
          disableTypescript: noTs || false,
        });
      } else {
        name = "root";
        isPackage = undefined;
        configs.setRoot({
          packageJson,
          tsconfig,
          rootDirName: null,
          dirName: parse(path).name,
          location: path.replace(/\\/g, "/"),
          name: "root",
          isPackage: undefined,
          projMan,
          disableTypescript: false,
        });
      }
    }
  }

  return configs;
};
