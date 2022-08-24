import yarn from "@yarnpkg/shell";
import { commaSeparatedList } from "./tools/comma-list";
import { questionsMonoList } from "./tools/questions";
import { striPEqualsFromString } from "./tools/strip-eq-from-string";
import { WorkspacesMap } from "./tools/workspaces/workspaces-map";
import { CallBack } from "./types/generics";

export type InstallAction = CallBack<
  [string, { installTo?: string; args?: string }],
  Promise<void>
>;

export const install: InstallAction = async (
  packageToInstall,
  { installTo, args }
) => {
  const workspaces = new WorkspacesMap();
  let targetPkg: string | undefined;
  if (installTo === undefined) {
    const name = await questionsMonoList.selectAWorkspace(workspaces);
    targetPkg = name?.name;
  } else {
    targetPkg = workspaces.findByName(striPEqualsFromString(installTo))?.name;
  }
  const argum = args
    ? commaSeparatedList(striPEqualsFromString(args)).join(" ")
    : undefined;

  if (targetPkg !== undefined) {
    await yarn.execute(
      `yarn workspace ${targetPkg} add ${packageToInstall}${
        argum !== undefined ? argum : ""
      }`
    );
  }
};
