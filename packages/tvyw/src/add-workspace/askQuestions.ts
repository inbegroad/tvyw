import { getDirnameFromPackageName } from "../tools/dirname-from-package-name";
import { isPackagable, isWebApp } from "../tools/package-props";
import { questionsMonoList } from "../tools/questions";
import { striPEqualsFromString } from "../tools/strip-eq-from-string";
import { AddWorkspaceQuestionType } from "../types/actions";
import { WorkspaceType } from "../types/from-schema";

export const askAddWorkspaceQuestions: AddWorkspaceQuestionType = async (
  name,
  { framework: fw, workspaceType: wt }
) => {
  const packageName = await questionsMonoList.packageName(
    undefined,
    name ? striPEqualsFromString(name) : undefined
  );
  const framework = await questionsMonoList.framework(
    fw ? striPEqualsFromString(fw) : undefined
  );
  let workspaceType: WorkspaceType;
  if (!isPackagable(framework)) {
    workspaceType = "app";
  } else if (!isWebApp(framework)) {
    workspaceType = "package";
  } else {
    workspaceType = await questionsMonoList.workspaceType(
      wt ? striPEqualsFromString(wt) : undefined
    );
  }
  // const workspaceStructure = await questionsMonoList.workspaceStructure(
  //   workspaceStructure
  // );
  return {
    framework,
    // workspaceStructure,
    workspaceType,
    dirName: getDirnameFromPackageName(packageName),
    packageName,
  };
};
