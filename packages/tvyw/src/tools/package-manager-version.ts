import child from "child_process";

export const getPackageManagerVersion = (): string => {
  return `yarn@${child.execSync("yarn --version").toString().trim()}`;
};
