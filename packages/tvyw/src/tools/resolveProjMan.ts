import { join } from "path";
import { transpileConfig } from "./transpile-config";
import { getVersionConfig } from "./version-config";

export const resolveConfig = (path = process.cwd()) => {
  const { name } = getVersionConfig();

  const configPath = {
    js: join(path, `${name}.js`),
    ts: join(path, `${name}.ts`),
  };
  const transpiledConfigFile = transpileConfig(configPath.ts, configPath.js);
  return transpiledConfigFile;
};
