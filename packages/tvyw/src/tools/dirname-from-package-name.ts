import { getValidName } from "./pkg-name";

export const getDirnameFromPackageName = (packageName: string) =>
  getValidName(packageName).replace(/@/g, "").replace(/\//g, "-");
