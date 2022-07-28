import { execute } from "@yarnpkg/shell";
import { projectBuild } from "./project-build";
import { ProjManType } from "./types";
import { ProjManCmdType } from "./types/from-schema";
import { getEntryExtentionFromFramework } from "./tools/extention-from-framework";
import { resolveConfig } from "./tools/resolveProjMan";
import { scriptsEnum } from "./defs";
import { emptyDirSync } from "fs-extra";
import { getVersionConfig } from "./tools/version-config";

export const run = async (cmd: ProjManCmdType) => {
  if (cmd === "scaf") {
    await scaf();
  } else {
    const projMan = resolveConfig();
    if (projMan.repoType === "monoRepo" && projMan.root) {
      await scaf(cmd === "dev");
      await execute(`turbo run ${cmd}`);
    } else {
      if (projMan.repoType === "monoRepo" && !projMan.root) {
        await runS(projMan, cmd);
      } else {
        await scaf(cmd === "dev");
        await runS(projMan, cmd);
      }
    }
  }
};

async function runS(projMan: Required<ProjManType>, cmd: ProjManCmdType) {
  if (
    ((projMan.repoType === "monoRepo" && !projMan.root) ||
      projMan.repoType === "single") &&
    projMan.workspaceType === "package"
  ) {
    emptyDirSync(projMan.declarationDir);
  }
  if (
    (projMan.repoType === "monoRepo" && !projMan.root) ||
    projMan.repoType === "single"
  ) {
    const {
      buildDir,
      entries,
      entriesDir,
      declarationDir,
      framework,
      workspaceType,
    } = projMan;
    const { name } = getVersionConfig();
    switch (framework) {
      case "express": {
        switch (cmd) {
          case "preview":
          case "start": {
            await execute(`node ./${buildDir}/${entries}.js`);
            break;
          }
          case "dev": {
            emptyDirSync(`./${declarationDir}`);
            await execute(
              `ts-node-dev ./${entriesDir}/${entries}.${getEntryExtentionFromFramework(
                "express"
              )} --swc`
            );
            break;
          }
          default: {
            emptyDirSync(`./${declarationDir}`);
            await execute(scriptsEnum.express[workspaceType][cmd]);
            break;
          }
        }
        break;
      }
      case "custom": {
        console.log(
          `You configured this workspace's framework as '"custom" so ${name} will not run ${cmd} on it`
        );

        break;
      }
      default: {
        emptyDirSync(`./${declarationDir}`);
        await execute(scriptsEnum[framework][workspaceType][cmd]);
        break;
      }
    }
  }
}

async function scaf(isDev = false) {
  const time = "Building project structure completed in";
  console.time(time);
  await projectBuild(isDev);
  console.timeEnd(time);
}
