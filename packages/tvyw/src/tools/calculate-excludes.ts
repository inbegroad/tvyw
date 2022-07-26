import { ProjManType } from "../types";
import { getVersionConfig } from "./version-config";

export const calculateExcludes = (projMan: ProjManType): string[] => {
  const { name } = getVersionConfig();
  let ex: string[] = [];
  if (
    (projMan.repoType === "monoRepo" && !projMan.root) ||
    projMan.repoType === "single"
  ) {
    ex = [
      "node_modules",
      "vite.config.ts",
      `${name}.ts`,
      `${projMan.buildDir}/*`,
      `${projMan.testsDir}/*`,
      ...(projMan.extraExclude || []),
    ];
  }

  return [...new Set(ex)];
};
