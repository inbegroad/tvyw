import yarn from "@yarnpkg/shell";
import { commaSeparatedList } from "./tools/comma-list";
import { questionsMonoList } from "./tools/questions";
import { striPEqualsFromString } from "./tools/strip-eq-from-string";
import { findWorkspaceByName } from "./tools/workspaces-list";
import { CallBack } from "./types/generics";

export type InstallAction = CallBack<
  [string, { installTo?: string; args?: string }],
  Promise<void>
>;

export const install: InstallAction = async (
  packageToInstall,
  { installTo, args }
) => {
  let targetPkg: string | undefined;
  if (installTo === undefined) {
    const name = await questionsMonoList.selectAWorkspace();
    targetPkg = name?.name;
  } else {
    targetPkg = findWorkspaceByName(striPEqualsFromString(installTo))?.name;
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
