import { execute } from "@yarnpkg/shell";
import { existsSync, mkdirSync } from "fs-extra";
import { join, parse } from "path";
import { readPackageJson } from "./tools/read";
import { resolveConfig } from "./tools/resolveProjMan";
import { getVersionConfig } from "./tools/version-config";
import { writePackageJson } from "./tools/write";
import { ProjManType } from "./types";

export const deploy = async () => {
  const projMan = resolveConfig();
  if (projMan.repoType === "monoRepo" && projMan.root) {
    await execute(`turbo run deploy`);
  } else {
    if (projMan.workspaceType === "app")
      throw new Error("You can't deploy an app");
    await dep(projMan);
  }
};

async function dep(projMan: Required<ProjManType>) {
  if (
    (projMan.repoType === "single" &&
      projMan.workspaceType === "package" &&
      projMan.deploy) ||
    (projMan.repoType === "monoRepo" &&
      !projMan.root &&
      projMan.workspaceType === "package" &&
      projMan.deploy)
  ) {
    const versionJson = getVersionConfig();
    const pkgJson = await readPackageJson();

    const cachedPath = join(
      projMan.fullPath,
      ...projMan.location.split("/").map(() => ".."),
      "node_modules",
      `.cache/${versionJson.name}/${parse(projMan.location).name}`
    );

    if (!existsSync(cachedPath)) mkdirSync(cachedPath, { recursive: true });
    const cachedFilePath = join(
      cachedPath,
      `${parse(projMan.location).name}.temp.json`
    );

    await writePackageJson(pkgJson, cachedFilePath);
    delete pkgJson.scripts;
    delete pkgJson.devDependencies;
    await writePackageJson(pkgJson);
    await execute("npm publish");

    const temp = await readPackageJson(cachedFilePath);
    console.log({ temp, pkgJson });
    await writePackageJson(temp, cachedFilePath);
  }
}
