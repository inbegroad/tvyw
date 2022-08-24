import { IOptions, sync, hasMagic } from "glob";
import { join } from "path";
import ts from "typescript";
import { isFile } from "../../tools/is-file";
import { WorkspaceDetailsType } from "../../tools/workspaces/types";

export function resolveConfig(workspace: WorkspaceDetailsType) {
  const { tsconfig, location: cwd } = workspace;
  const files: Set<string> = new Set<string>();
  const cache: IOptions["cache"] = {};
  let options: ts.CompilerOptions = {};
  const globOptions: IOptions = {
    cwd,
    cache,
  };
  if (tsconfig) {
    const { include, exclude: tsEx } = tsconfig;
    const tsOptions = tsconfig.compilerOptions as ts.CompilerOptions;
    options = {
      ...tsOptions,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ESNext,
    };
    const nodeModulesExclues = sync(
      join(workspace.location, "node_modules/**/*")
    );
    const exclude = [...(tsEx || [])].concat(nodeModulesExclues);
    if (globOptions.ignore === undefined) {
      globOptions.ignore = exclude;
    } else if (typeof globOptions.ignore === "string") {
      globOptions.ignore = [globOptions.ignore, ...exclude];
    } else {
      globOptions.ignore.concat(exclude);
    }

    if (include) {
      for (const ent of include) {
        if (isFile(ent)) {
          files.add(ent);
        } else {
          if (hasMagic(ent)) {
            files.add(ent);
          } else {
            const file = `${ent}/**/*.{ts,tsx,vue,svelte}`;
            const curr = sync(file, globOptions).filter(
              (fi) => !fi.includes("d.ts")
              // (fi) => fi
            );

            curr.forEach((fi) => files.add(fi));
          }
        }
      }
    }
  }

  return { files: [...files], options, host: ts.createCompilerHost(options) };
}
