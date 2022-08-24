import { statSync } from "fs-extra";

export function isFile(src: string) {
  const input = statSync(src);
  return input.isFile();
}
