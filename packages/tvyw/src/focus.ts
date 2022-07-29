import yarn from "@yarnpkg/shell";
import { questionsMonoList } from "./tools/questions";
import { striPEqualsFromString } from "./tools/strip-eq-from-string";
import { findWorkspaceByName } from "./tools/workspaces-list";
import { CallBack } from "./types/generics";

export type FocusAction = CallBack<
  [string, { focusTo?: string }],
  Promise<void>
>;

export const focus: FocusAction = async (cmd, { focusTo }) => {
  let targetPkg: string | undefined;
  if (focusTo === undefined) {
    const name = await questionsMonoList.selectAWorkspace();
    targetPkg = name?.name;
  } else {
    targetPkg = findWorkspaceByName(striPEqualsFromString(focusTo))?.name;
  }
  if (targetPkg !== undefined) {
    await yarn.execute(`yarn workspace ${targetPkg} ${cmd}`);
  }
};
