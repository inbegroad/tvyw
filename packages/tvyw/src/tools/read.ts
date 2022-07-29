import fsExtra from "fs-extra";
import path from "path";
import { PackageJsonType, TsconfigType } from "../types";

export const readSync = <T>(filePath: string) =>
  fsExtra.readJSONSync(filePath, {
    encoding: "utf8",
  }) as T;
export const read = async <T>(filePath: string): Promise<T> =>
  fsExtra.readJSON(filePath, {
    encoding: "utf8",
  }) as Promise<T>;

//sync
export const readPackageJsonSync = (src = process.cwd()) =>
  readSync<PackageJsonType>(path.join(src, "package.json"));

export const readTsconfigSync = (src = process.cwd()) =>
  readSync<TsconfigType>(path.join(src, "tsconfig.json"));

export const readPackageJson = async (src = process.cwd()) =>
  await read<PackageJsonType>(path.join(src, "package.json"));
export const readTsconfig = async (src = process.cwd()) =>
  await read<TsconfigType>(path.join(src, "tsconfig.json"));
