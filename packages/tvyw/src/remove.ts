import yarn from "@yarnpkg/shell";
import { haveDependency } from "./tools/have-dependency";
import { questionsMonoList } from "./tools/questions";
import fsExtra from "fs-extra";
import { CallBack } from "./types/generics";
import { WorkspacesMap } from "./tools/workspaces/workspaces-map";

type RemoveCmdType = CallBack<[string | undefined], Promise<void>>;

export const remove: RemoveCmdType = async (target) => {
  const workspaces = new WorkspacesMap();
  const wsAnswer = await questionsMonoList.removeWorkspace(workspaces, target);
  const newWorkspaces = workspaces.findByName(wsAnswer?.name);
  if (wsAnswer) {
    if (
      haveDependency(wsAnswer.name, newWorkspaces?.packageJson.dependencies)
    ) {
      await yarn.execute(
        `yarn workspace ${newWorkspaces?.name} remove ${wsAnswer.name}`
      );
    }
    fsExtra.remove(wsAnswer.location);
  }
};
