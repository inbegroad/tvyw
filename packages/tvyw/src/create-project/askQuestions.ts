import path from "path";
import { isPackagable, isWebApp } from "../tools/package-props";
import { questionsMonoList } from "../tools/questions";
import { striPEqualsFromString } from "../tools/strip-eq-from-string";
import { NewProjectQuestionType } from "../types/actions";
import { WorkspaceType } from "../types/from-schema";

export const askQuestions: NewProjectQuestionType = async (
  dir,
  { repoType: rt, framework: fw, install, packageName: pn, workspaceType: wt }
) => {
  const root = path.resolve(dir).replace(/\\/g, "/");
  const parsedPath = path.parse(root);

  const repoType = await questionsMonoList.repoType(
    rt ? striPEqualsFromString(rt) : undefined
  );

  if (repoType === "single") {
    const packageName = await questionsMonoList.packageName(
      parsedPath,
      pn ? striPEqualsFromString(pn) : undefined
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
    // const install = await questionsMonoList.install(install);

    return {
      repoType: "single",
      framework,
      packageName,
      workspaceType,
      // install,
      root,
      // workspaceStructure,
    };
  } else {
    // const install = await questionsMonoList.install(install);
    return {
      repoType: "monoRepo",
      install,
      root,
    };
  }
};
