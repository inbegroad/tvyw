import path from "path";

export const refPackages = (src: string, dist: string) => {
  const toHome = src
    .split("/")
    .map(() => "..")
    .join("/");
  return path.join(toHome, dist).replace(/\\/g, "/");
};
