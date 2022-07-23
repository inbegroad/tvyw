import camelCase from "camelcase";
import { nodeModulesEnum } from "../schemas";
import { PackageJsonType } from "../types";
import { CallBack } from "../types/generics";

type Return = {
  globals?: Record<string, string>;
  external?: string[];
  // alias?: AliasOptions;
};
type Props = CallBack<
  [
    {
      isPackage: boolean;
      packageJson: PackageJsonType;
    }
  ],
  Return
>;

const getAllImports = ({ dependencies }: PackageJsonType, isPackage: boolean) =>
  [...(!isPackage ? nodeModulesEnum : [])].concat(
    !isPackage ? [] : dependencies ? Object.keys(dependencies) : []
  );

export const externalsTool: Props = ({ packageJson, isPackage }) => {
  const globals: Record<string, string> | undefined = {};
  const external = getAllImports(packageJson, isPackage);
  external.forEach((ext) => {
    if (ext === "path") globals["path"] = "path-browserify";
    else if (nodeModulesEnum.includes(ext))
      globals[ext] = "rollup-plugin-node-builtins";
    else globals[ext] = camelCase(ext);
    // if (globals) {
    // }
  });

  return {
    globals,
    external,
    // alias: !isPackage ? alias : undefined,
  };
};
