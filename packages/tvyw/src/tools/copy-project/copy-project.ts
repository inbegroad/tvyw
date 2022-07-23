import fsExtra from "fs-extra";
import path from "path";
import { ProjManLooseType } from "../../types/from-schema";
import { copy } from "./copy";
import { getTemplateDir, GetTemplateDirPropsType } from "./get-template-dir";
import { renames } from "./renamed-files";

export type CopyProjectType = (
  props: Pick<
    Partial<ProjManLooseType>,
    "repoType" | "framework" | "workspaceType"
  > & {
    isRoot?: boolean;
    root: string;
  }
) => Promise<void>;

export const copyProject: CopyProjectType = async ({
  repoType = "monoRepo",
  root,
  isRoot = false,
  framework = "vanilla",
  workspaceType,
}) => {
  const props: GetTemplateDirPropsType =
    repoType === "monoRepo"
      ? isRoot
        ? { repoType, root: true }
        : { repoType, root: false, framework }
      : { repoType, framework };
  const templateDir = getTemplateDir(props);

  const editorconfigOrignalFile = path.join(root, ".editorconfig");
  if (fsExtra.existsSync(path.join(editorconfigOrignalFile)))
    fsExtra.removeSync(editorconfigOrignalFile);

  if (!fsExtra.existsSync(templateDir)) {
    throw new Error(
      `Template directory not found: ${templateDir}, please report a bug`
    );
  }
  const templateFilesFilter = ["pkg-src", "src"];
  const templateFiles = fsExtra
    .readdirSync(templateDir)
    .filter((file) => !file.startsWith("__"))
    .filter((file) => !templateFilesFilter.includes(file));

  const templateFilesToRename = Object.keys(renames).filter((fi) =>
    repoType === "monoRepo" && !isRoot
      ? !fi.includes("ignore") && !fi.includes("editorconfig")
      : fi
  );

  const copyFiles: { src: string; dist: string }[] = [];

  for (const file of templateFiles) {
    const src = path.join(templateDir, file);
    const dist = path.join(root, file);
    copyFiles.push({ src, dist });
  }

  for (const file of templateFilesToRename) {
    if (fsExtra.existsSync(path.join(templateDir, file))) {
      const copyFile = {
        src: path.join(templateDir, file),
        dist: path.join(root, renames[file]),
      };

      copyFiles.push(copyFile);
    }
  }

  const srcDirpath = path.join(
    templateDir,
    workspaceType === "app" ? "src" : "pkg-src"
  );
  if (fsExtra.existsSync(srcDirpath)) {
    const srcDir = fsExtra.readdirSync(srcDirpath);

    for (const srcName of srcDir) {
      const copyFile = {
        src: path.join(srcDirpath, srcName),
        dist: path.join(root, srcName),
      };
      copyFiles.push(copyFile);
    }
  }
  if ((repoType === "monoRepo" && isRoot) || repoType === "single") {
    fsExtra.writeFileSync(path.join(root, "yarn.lock"), "", {
      encoding: "utf8",
    });
  }

  for (const { dist, src } of copyFiles) {
    copy(src, dist);
  }
};
