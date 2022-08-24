import yarn from "@yarnpkg/shell";
import { questionsMonoList } from "./tools/questions";
import { striPEqualsFromString } from "./tools/strip-eq-from-string";
import { WorkspacesMap } from "./tools/workspaces/workspaces-map";
import { CallBack } from "./types/generics";

export type FocusAction = CallBack<
  [string, { focusTo?: string }],
  Promise<void>
>;

export const focus: FocusAction = async (cmd, { focusTo }) => {
  const workspaces = new WorkspacesMap();
  let targetPkg: string | undefined;
  if (focusTo === undefined) {
    const name = await questionsMonoList.selectAWorkspace(workspaces);
    targetPkg = name?.name;
  } else {
    targetPkg = workspaces.findByName(striPEqualsFromString(focusTo))?.name;
  }
  if (targetPkg !== undefined) {
    await yarn.execute(`yarn workspace ${targetPkg} ${cmd}`);
  }
};
