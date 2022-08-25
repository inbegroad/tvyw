import { PackageJsonType } from "../types";
import { FrameworksType } from "../types/from-schema";
import { getVersionConfig } from "./version-config";
type ScriptsType = {
  build: string;
  dev: string;
  preview?: string;
  deploy?: string;
} & Record<string, string>;
export const getScripts = (
  framework?: FrameworksType,
  isPackage = false,
  isDeploy = false
): PackageJsonType["scripts"] => {
  const { name, dev } = getVersionConfig();
  const devScript = dev ? "yarn " : "";
  const monoRootScripts: ScriptsType = {
    build: `${devScript}${name} build`,
    dev: `${devScript}${name}`,
    preview: `${devScript}${name} preview`,
    start: `${devScript}${name} start`,
    deploy: `${devScript}${name} deploy`,
  };
  const defaultScripts: ScriptsType = {
    build: `${devScript}${name} build`,
    dev: `${devScript}${name}`,
  };
  if (dev) {
    defaultScripts[name] = "node node_modules/tvyw/bin/index.js";
    monoRootScripts[name] = "node node_modules/tvyw/bin/index.js";
  }
  if (isDeploy) {
    defaultScripts.deploy = `${devScript}${name} deploy`;
  }
  if (!isPackage) {
    defaultScripts["preview"] = `${devScript}${name} preview`;
  }
  switch (framework) {
    case "react":
    case "preact":
    case "vanilla":
    case "vue":
      return defaultScripts;
    // case "express":
    //   return {
    //     ...defaultScripts,
    //     start: `${name} start`,
    //   };
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
      return monoRootScripts;
  }
};
