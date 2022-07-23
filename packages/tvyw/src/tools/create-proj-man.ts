import { readFileSync } from "fs-extra";
import { ProjManLooseType, RepoType } from "../types/from-schema";
import { getTemplateProjMan } from "./copy-project/template-projman";
import { configDefaults } from "./defaults";
import { writeProjManSync } from "./write";

type Props = {
  repoType: RepoType;
  packageName: string;
  root: boolean;
  src: string;
  projMan?: Partial<Omit<ProjManLooseType, "repoType" | "packageName">>;
};

export const createProjMan = ({
  packageName,
  projMan = {},
  repoType,
  src,
  root,
}: Props) => {
  if (repoType === "monoRepo") {
    if (root) {
      const projManTemplate = getTemplateProjMan({
        repoType,
        root,
      });
      const projManString = readFileSync(projManTemplate)
        .toString()
        .replace("__repoType__", JSON.stringify(repoType))
        .replace("__root__", JSON.stringify(root));

      writeProjManSync(projManString, src);
    } else {
      const projManTemplate = getTemplateProjMan({
        repoType,
        root,
        framework: projMan.framework || configDefaults.framework,
      });
      const projManString = readFileSync(projManTemplate)
        .toString()
        .replace("__repoType__", JSON.stringify(repoType))
        .replace("__root__", JSON.stringify(root))
        .replace("__framework__", JSON.stringify(projMan.framework))
        .replace("__packageName__", JSON.stringify(packageName))
        .replace("__workspaceType__", JSON.stringify(projMan.workspaceType));

      writeProjManSync(projManString, src);
    }
  } else {
    const projManTemplate = getTemplateProjMan({
      repoType,
      root,
      framework: projMan.framework || configDefaults.framework,
    });
    const projManString = readFileSync(projManTemplate)
      .toString()
      .replace("__repoType__", JSON.stringify(repoType))
      .replace("__root__", JSON.stringify(true))
      .replace("__framework__", JSON.stringify(projMan.framework))
      .replace("__packageName__", JSON.stringify(packageName))
      .replace("__workspaceType__", JSON.stringify(projMan.workspaceType));

    writeProjManSync(projManString, src);
  }
};
