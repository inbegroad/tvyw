import { PackageJsonType } from "../types";
import { FrameworksType } from "../types/from-schema";
import { getVersionConfig } from "./version-config";

export const getScripts = (
  framework?: FrameworksType,
  isPackage = false,
  isDeploy = false
): PackageJsonType["scripts"] => {
  const { name } = getVersionConfig();
  const defaultScripts: {
    build: string;
    dev: string;
    preview?: string;
    deploy?: string;
  } = {
    build: `${name} build`,
    dev: `${name}`,
  };
  if (isPackage) {
    defaultScripts["preview"] = `${name} preview`;
    if (isDeploy) {
      defaultScripts.deploy = `${name} deploy`;
    }
  }
  switch (framework) {
    case "react":
    case "preact":
    case "vanilla":
    case "vue":
      return defaultScripts;
    case "express":
      return {
        ...defaultScripts,
        start: `${name} start`,
      };
    case "svelte":
      return {
        ...defaultScripts,
        check: "svelte-check --tsconfig ./tsconfig.json",
      };
    case "custom":
      return {
        scaf: `${name} scaf`,
      };
    default:
      return {
        build: `${name} build`,
        dev: `${name}`,
        preview: `${name} preview`,
        start: `${name} start`,
        deploy: `${name} deploy`,
      };
  }
};
