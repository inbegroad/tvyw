import { execute } from "@yarnpkg/shell";
import { existsSync, mkdirSync } from "fs-extra";
import { join } from "path";
import { readPackageJson } from "./tools/read";
import { getVersionConfig } from "./tools/version-config";
import { WorkspaceDetailsType } from "./tools/workspaces/types";
import { WorkspacesMap } from "./tools/workspaces/workspaces-map";
import { writePackageJson } from "./tools/write";

export const deploy = async () => {
  const workspaces = new WorkspacesMap();
  const root = workspaces.root;
  if (root.projMan.repoType === "monoRepo" && root.projMan.root) {
    for (const workspace of workspaces.workspacesList) {
      let newPackageJson = workspace.packageJson;
      const deps = newPackageJson.dependencies || {};
      for (const dep of Object.keys(deps)) {
        const version = workspaces.findByName(dep)?.packageJson.version;
        if (version) {
          newPackageJson = {
            ...newPackageJson,
            dependencies: {
              ...newPackageJson.dependencies,
              [dep]: version,
            },
          };
        }
      }
      await writePackageJson(newPackageJson, workspace.location);
      await dep(workspace);
    }
  } else {
    await dep(workspaces.root);
  }
};

async function dep(workspace: WorkspaceDetailsType) {
  const versionJson = getVersionConfig();
  const pkgJson = await readPackageJson();
  const cachedPath = join(
    workspace.location,
    ...workspace.location.split("/").map(() => ".."),
    "node_modules",
    `.cache/${versionJson.name}/${workspace.dirName}`
  );
  if (!existsSync(cachedPath)) mkdirSync(cachedPath, { recursive: true });
  const cachedFilePath = join(cachedPath, `${workspace.dirName}.temp.json`);
  await writePackageJson(pkgJson, cachedFilePath);
  delete pkgJson.scripts;
  delete pkgJson.devDependencies;
  await writePackageJson(pkgJson);
  await execute("npm publish");
  const temp = await readPackageJson(cachedFilePath);
  await writePackageJson(temp, cachedFilePath);
}
