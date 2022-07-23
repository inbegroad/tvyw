import yarn from "@yarnpkg/shell";
import { questionsMonoList } from "./tools/questions";
import { getWorkspacesList } from "./tools/workspaces-list";
import { CallBack } from "./types/generics";

type AddCmdType = CallBack<[string], Promise<void>>;

export const add: AddCmdType = async (target) => {
  const workspaces = getWorkspacesList(true);

  const added = await questionsMonoList.addkWorkspaceDeps(target, workspaces);
  if (added) {
    const { target, targetInstalls } = added;
    for (const install of targetInstalls) {
      await yarn.execute(`yarn workspace ${target} add ${install}`);
    }
  }
};
