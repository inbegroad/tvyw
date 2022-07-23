import {
  existsSync,
  mkdirsSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "fs-extra";
import { parse } from "path";
import typescript from "typescript";
import { ProjManType } from "../types";

export const transpileConfig = (ts: string, js: string) => {
  const codeTs = readFileSync(ts, "utf8").toString();
  const transpiledCode = typescript.transpileModule(codeTs, {
    compilerOptions: { isolatedModules: true },
  }).outputText;
  const cachDir = parse(js).dir;

  if (!existsSync(cachDir)) mkdirsSync(cachDir);
  writeFileSync(js, transpiledCode, { encoding: "utf8" });

  const projMan = require(js).default as ProjManType;
  unlinkSync(js);
  return projMan;
};
