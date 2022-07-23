import { copyProject } from "../tools/copy-project";
import { createProjMan } from "../tools/create-proj-man";
import { processPackageJson } from "../tools/process-package-json";
import { askQuestions } from "./askQuestions";
import fsExtra from "fs-extra";
import yarn from "@yarnpkg/shell";
import { getPackageManagerVersion } from "../tools/package-manager-version";
import { initYarn } from "../tools/init-yarn";
import { writePackageJson } from "../tools/write";
import { questionsMonoList } from "../tools/questions";
import { NewProjectActionType } from "../types/actions";
import { isDirEmpty } from "../tools/is-empty-dir";

export const createProject: NewProjectActionType = async (dir, props) => {
  const answers = await askQuestions(dir, props);
  if (fsExtra.existsSync(answers.root)) {
    if (!isDirEmpty(answers.root)) {
      const orProps = await questionsMonoList.overwrite(props.overwrite);
      if (!orProps) {
        throw new Error(
          "Project already exists, and you chose not to overwrite it."
        );
      }
      fsExtra.emptyDir(answers.root);
    }
  } else {
    fsExtra.ensureDir(answers.root);
  }

  await initYarn(answers.repoType === "monoRepo", answers.root);
  if (answers.repoType === "monoRepo") {
    const { repoType, root } = answers;

    await copyProject({
      repoType,
      root,
      isRoot: true,
    });
    createProjMan({
      packageName: "root",
      repoType,
      src: root,
      root: true,
    });

    await writePackageJson(
      processPackageJson({
        packageJson: {
          name: "root",
          private: true,
          license: "MIT",
          packageManager: getPackageManagerVersion(),
        },
        repoType,
        appsRootDir: "apps",
        packagesRootDir: "packages",
        root: true,
      }),
      root
    );
  } else {
    const {
      framework,
      repoType,
      root,
      workspaceType,
      packageName,
      // workspaceStructure,
    } = answers;
    await copyProject({
      framework,
      repoType,
      root,
      workspaceType,
      isRoot: true,
    });
    createProjMan({
      packageName: answers.packageName,
      projMan: {
        // workspaceStructure,
        workspaceType,
        framework,
      },
      repoType,
      src: root,
      root: true,
    });
    await writePackageJson(
      processPackageJson({
        packageJson: {
          name: packageName,
          version: "0.0.0",
          private: workspaceType === "app" ? true : undefined,
          license: "MIT",
          packageManager: getPackageManagerVersion(),
        },
        repoType,
        workspaceType,
        framework,
        root: true,
      }),
      root
    );
  }
  if (props.install) {
    await yarn.execute("yarn");
  }
};
