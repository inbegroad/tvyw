import { PackageJsonType } from "../types";
import { ProjManLooseType } from "../types/from-schema";

type FilesType = Pick<PackageJsonType, "main" | "module" | "types" | "exports">;
type PropsType = Partial<FilesType> &
  Pick<
    ProjManLooseType,
    "framework" | "workspaceType" | "buildDir" | "entries" | "declarationDir"
  >;

export const getPackageJsonFiles = ({
  buildDir,
  declarationDir,
  entries,
  framework,
  workspaceType,
  ...props
}: PropsType): FilesType => {
  const getFullFiles = (): FilesType => ({
    main: `${buildDir}/${entries}.js`,
    module: `${buildDir}/${entries}.es.js`,
    types: `${declarationDir}/${entries}.d.ts`,
    exports: {
      ".": {
        import: `./${buildDir}/${entries}.es.js`,
        require: `./${buildDir}/${entries}.js`,
        default: `./${buildDir}/${entries}.umd.js`,
        node: `./${buildDir}/${entries}.js`,
      },
    },
  });
  return framework === "custom"
    ? props
    : workspaceType === "app"
    ? props
    : getFullFiles();
};
