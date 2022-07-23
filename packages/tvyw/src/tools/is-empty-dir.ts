import fsExtra from "fs-extra";

export function isDirEmpty(pat: string) {
  return fsExtra.readdirSync(pat).length === 0;
}
