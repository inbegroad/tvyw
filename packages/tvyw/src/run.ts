import { execute } from "@yarnpkg/shell";
import { projectBuild } from "./project-build";
import { ProjManType } from "./types";
import { ProjManCmdType } from "./types/from-schema";
import { getEntryExtentionFromFramework } from "./tools/extention-from-framework";
import { resolveConfig } from "./tools/resolveProjMan";
import { scriptsEnum } from "./defs";

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

async function runS(projMan: ProjManType, cmd: ProjManCmdType) {
  if (
    (projMan.repoType === "monoRepo" && !projMan.root) ||
    projMan.repoType === "single"
  ) {
    const { buildDir, entries, entriesDir, framework, workspaceType } = projMan;
    const execScript =
      framework === "express" && cmd === "preview"
        ? `node ./${buildDir}/${entries}.js`
        : framework === "express" && cmd === "dev"
        ? `ts-node-dev ./${entriesDir}/${entries}.${getEntryExtentionFromFramework(
            "express"
          )} --swc`
        : scriptsEnum[framework][workspaceType][cmd] ||
          `echo ${cmd} script is not avilavle for this package`;
    switch (framework) {
      case "express": {
        switch (cmd) {
          case "preview": {
            await execute(`node ./${buildDir}/${entries}.js`);
            break;
          }
          case "dev": {
            await execute(
              `ts-node-dev ./${entriesDir}/${entries}.${getEntryExtentionFromFramework(
                "express"
              )} --swc`
            );
            break;
          }
          default: {
            await execute(scriptsEnum.express[workspaceType][cmd]);
            break;
          }
        }
        break;
      }
      case "custom": {
        break;
      }
      default: {
        await execute(scriptsEnum[framework][workspaceType][cmd]);
        break;
      }
    }
    await execute(execScript);
  }
}

async function scaf(isDev = false) {
  const time = "Building project structure completed in";
  console.time(time);
  await projectBuild(isDev);
  console.timeEnd(time);
}
