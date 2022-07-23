import fsExtra from "fs-extra";
import path from "path";
import { PackageJsonType, TsconfigType } from "../types";

export const readSync = <T>(filePath: string) => {
  if (!fsExtra.existsSync(filePath)) {
    throw new Error(`File ${filePath} does not exist on ${process.cwd()}`);
  } else
    return fsExtra.readJSONSync(filePath, {
      encoding: "utf8",
    }) as T;
};
export const read = async <T>(filePath: string): Promise<T> => {
  if (!fsExtra.existsSync(filePath))
    return Promise.reject(
      `File ${filePath} does not exist on ${process.cwd()}`
    );
  else
    return fsExtra.readJSON(filePath, {
      encoding: "utf8",
    });
};

//sync
export const readPackageJsonSync = (src = process.cwd()) =>
  readSync<PackageJsonType>(path.join(src, "package.json"));

export const readTsconfigSync = (src = process.cwd()) =>
  readSync<TsconfigType>(path.join(src, "tsconfig.json"));

export const readPackageJson = async (src = process.cwd()) =>
  await read<PackageJsonType>(path.join(src, "package.json"));
export const readTsconfig = async (src = process.cwd()) =>
  await read<TsconfigType>(path.join(src, "tsconfig.json"));
