import { execute } from "@yarnpkg/shell";
import { existsSync, mkdirSync } from "fs-extra";
import { join } from "path";
import { readPackageJson } from "./tools/read";
import { resolveConfig } from "./tools/resolveProjMan";
import { getVersionConfig } from "./tools/version-config";
import { writePackageJson } from "./tools/write";

export const deploy = async () => {
  const projMan = resolveConfig();
  if (projMan.repoType === "monoRepo" && projMan.root) {
    await execute(`turbo run deploy`);
  } else {
    if (projMan.workspaceType === "app")
      throw new Error("You can't deploy an app");
    await dep();
  }
};

async function dep() {
  const versionJson = getVersionConfig();
  const pkgJson = await readPackageJson();

  const cachedPath = join(
    process.cwd(),
    "..",
    "..",
    "node_modules",
    `.cache/${versionJson.name}/${pkgJson.name}`
  );

  if (!existsSync(cachedPath)) mkdirSync(cachedPath, { recursive: true });
  const cachedFilePath = join(cachedPath, `${pkgJson.name}.temp.json`);

  await writePackageJson(pkgJson, cachedFilePath);
  delete pkgJson.scripts;
  delete pkgJson.devDependencies;
  await writePackageJson(pkgJson);
  await execute("npm publish");
  const temp = await readPackageJson(cachedFilePath);
  await writePackageJson(temp, cachedFilePath);
}
