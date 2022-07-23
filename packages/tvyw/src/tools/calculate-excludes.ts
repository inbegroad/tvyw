import { ProjManType } from "../types";

export const calculateExcludes = (projMan: ProjManType): string[] => {
  let ex: string[] = [];
  if (
    (projMan.repoType === "monoRepo" && !projMan.root) ||
    projMan.repoType === "single"
  ) {
    ex = [
      "node_modules",
      "vite.config.ts",
      `${projMan.buildDir}/*`,
      `${projMan.testsDir}/*`,
      ...(projMan.extraExclude || []),
    ];
  }

  return [...new Set(ex)];
};
