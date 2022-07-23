import { z } from "zod";

import {
  workspaceTypeZod,
  frameworksZod,
  projManCmdZod,
  packageJsonSchema,
  tsconfigSchema,
  createProjManSchema,
  repoTypeZod,
} from "../schemas";

// export type ProjManType = z.infer<typeof projManSchema>
// ^?
export type ProjManLooseType = z.infer<typeof createProjManSchema>;
export type PackageJsonType = z.infer<typeof packageJsonSchema>;
export type TsconfigType = z.infer<typeof tsconfigSchema>;

export type WorkspaceType = z.infer<typeof workspaceTypeZod>;
export type FrameworksType = z.infer<typeof frameworksZod>;
export type RepoType = z.infer<typeof repoTypeZod>;
export type ProjManCmdType = z.infer<typeof projManCmdZod>;

export type ScriptsEnumType = {
  [key in FrameworksType]: {
    [key in WorkspaceType]?: {
      [key in ProjManCmdType]?: string | undefined;
    };
  };
};
