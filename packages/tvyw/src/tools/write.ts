import path from "path";
import fsExtra from "fs-extra";
import { sortPkgJsonFile } from "./sort-pkg-json";
import { PackageJsonType, TsconfigType } from "../types";
import { getVersionConfig } from "./version-config";

const { name } = getVersionConfig();

export const writeSync = <T>(filePath: string, content: T) =>
  fsExtra.writeJsonSync(filePath, content, {
    spaces: 2,
    encoding: "utf8",
    replacer: null,
  });
export const write = async <T>(filePath: string, content: T) =>
  await fsExtra.writeJson(filePath, content, {
    spaces: 2,
    encoding: "utf8",
    replacer: null,
  });

export const writePackageJsonSync = (
  packageJson: PackageJsonType,
  filePath = process.cwd()
) =>
  writeSync<PackageJsonType>(
    path.join(filePath, "package.json"),
    sortPkgJsonFile(packageJson)
  );

export const writeTsconfigSync = (
  tsconfig: TsconfigType,
  filePath = process.cwd()
) => writeSync<TsconfigType>(path.join(filePath, "tsconfig.json"), tsconfig);
export const writeProjManSync = (projMan: string, filePath: string) =>
  fsExtra.writeFileSync(path.join(filePath, `${name}.ts`), projMan);

//async
export const writePackageJson = async (
  packageJson: PackageJsonType,
  filePath = process.cwd()
) =>
  await write<PackageJsonType>(
    path.join(filePath, "package.json"),
    sortPkgJsonFile(packageJson)
  );
export const writeTsconfig = async (
  tsconfig: TsconfigType,
  filePath = process.cwd()
) => await write<TsconfigType>(path.join(filePath, "tsconfig.json"), tsconfig);
