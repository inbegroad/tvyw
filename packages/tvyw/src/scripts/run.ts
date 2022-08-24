import { projectBuild } from "../project-build";
import { WorkspacesMap } from "../tools/workspaces/workspaces-map";
import { ProjManCmdType } from "../types/from-schema";
import { runAProject } from "./run-a-project";
import { shell } from "./shell";

export async function run(cmd: ProjManCmdType) {
  const workspaces = new WorkspacesMap();

  if (cmd !== "test") {
    await projectBuild(workspaces, cmd === "dev");
  }
  if (cmd === "scaf" || cmd === "test") return;
  const root = workspaces.getRoot();
  if (root.projMan.repoType === "single") {
    await runAProject(cmd, root.projMan.packageName, workspaces, false);
  } else {
    const queue = workspaces.queue;
    const size = queue.getSize();
    for (let i = 1; i <= size; i++) {
      const itemName = queue.dequeue();
      if (itemName) {
        const curr = workspaces.findByName(itemName);
        if (curr) {
          if (workspaces.isCustom(curr)) {
            await runAProject(cmd, curr.name, workspaces, true);
          } else {
            shell(`yarn ${cmd}`, curr);
          }
        }
      }
    }
  }
}
