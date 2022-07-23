import yarn from "@yarnpkg/shell";
import { haveDependency } from "./tools/have-dependency";
import { questionsMonoList } from "./tools/questions";
import fsExtra from "fs-extra";
import { getWorkspacesList } from "./tools/workspaces-list";
import { CallBack } from "./types/generics";

type RemoveCmdType = CallBack<[string | undefined], Promise<void>>;

export const remove: RemoveCmdType = async (target) => {
  const workspaces = getWorkspacesList(true);
  const wsAnswer = await questionsMonoList.removeWorkspace(target, workspaces);
  if (wsAnswer) {
    const newWorkspaces = workspaces.workspaces.filter(
      (w) => w.name !== wsAnswer.name
    );
    for (const workspace of newWorkspaces) {
      if (haveDependency(wsAnswer.name, workspace.packageJson.dependencies)) {
        await yarn.execute(
          `yarn workspace ${workspace.name} remove ${wsAnswer.name}`
        );
      }
    }
    fsExtra.remove(wsAnswer.location);
  }
};
