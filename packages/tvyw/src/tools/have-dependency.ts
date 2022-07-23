import { PackageJsonType } from "../types";

export const haveDependency = (
  name: string,
  dependencies: PackageJsonType["dependencies"] = {}
) => dependencies[name] !== undefined;
