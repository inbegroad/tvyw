import yarn from "@yarnpkg/shell";
import { questionsMonoList } from "./tools/questions";
import { readPackageJson } from "./tools/read";
import { resolveConfig } from "./tools/resolveProjMan";
import { writePackageJson } from "./tools/write";

export const deploy = async () => {
  const projMan = resolveConfig();
  if (projMan.repoType === "monoRepo" && projMan.root) {
    await yarn.execute(`turbo run deploy`);
  } else {
    if (projMan.workspaceType === "app")
      throw new Error("You can't deploy an app");
    const pkgJson = await readPackageJson();
    const version = await questionsMonoList.version(
      pkgJson.name,
      pkgJson.version
    );
    pkgJson.version = version;
    await writePackageJson(pkgJson);
    console.log("Deploying...");

    // await yarn.execute("npm publish");
  }
};
