import { ProjManType } from "../types";
import { FrameworksType } from "../types/from-schema";
import { configDefaults } from "./defaults";

const getIncludesFromFramework = (
  framework: FrameworksType,
  entriesDir: string
) =>
  framework === "svelte"
    ? [
        `${entriesDir}/**/*.d.ts`,
        `${entriesDir}/**/*.ts`,
        `${entriesDir}/**/*.js`,
        `${entriesDir}/**/*.svelte`,
      ]
    : framework === "vue"
    ? [
        `${entriesDir}/**/*.ts`,
        `${entriesDir}/**/*.d.ts`,
        `${entriesDir}/**/*.tsx`,
        `${entriesDir}/**/*.vue`,
      ]
    : [entriesDir];

export const calculateIncludes = (projMan: ProjManType) => {
  if (projMan.repoType === "monoRepo" && projMan.root) return;
  else {
    const { framework, extraInclude = [], entriesDir } = projMan;
    return extraInclude.concat(
      getIncludesFromFramework(
        framework,
        entriesDir || configDefaults.entriesDir
      )
    );
  }
};
