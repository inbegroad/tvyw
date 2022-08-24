import yarn from "@yarnpkg/shell";
import { questionsMonoList } from "./tools/questions";
import { WorkspacesMap } from "./tools/workspaces/workspaces-map";
import { CallBack } from "./types/generics";

type AddCmdType = CallBack<[string], Promise<void>>;

export const add: AddCmdType = async (target) => {
  const workspaces = new WorkspacesMap();

  const added = await questionsMonoList.addkWorkspaceDeps(workspaces, target);
  if (added) {
    const { target, targetInstalls } = added;
    for (const install of targetInstalls) {
      await yarn.execute(`yarn workspace ${target} add ${install}`);
    }
  }
};
