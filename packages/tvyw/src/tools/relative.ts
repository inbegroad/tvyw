import { relative } from "path";

export const relativePackages = (from: string, to: string) =>
  relative(relative(process.cwd(), from), relative(process.cwd(), to)).replace(
    /\\/g,
    "/"
  );
