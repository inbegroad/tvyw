import { PackageJsonType } from "../types";
import { FrameworksType, RepoType, WorkspaceType } from "../types/from-schema";
import { getDependencies } from "./get-dependencies";
import { getScripts } from "./get-scripts";
import { objectKeys } from "./object-keys";

export type ProcessPackageJsonProps = {
  packageJson?: PackageJsonType;
  appsRootDir?: string;
  packagesRootDir?: string;
  framework?: FrameworksType;
  repoType: RepoType;
  workspaceType?: WorkspaceType;
  root: boolean;
  extraWorkspaces?: string[];
  deploy?: boolean;
};

export type ProcessPackageJsonType = (
  props: ProcessPackageJsonProps
) => PackageJsonType;

export const getPackageJosnType = (
  type?: PackageJsonType["type"],
  framework?: FrameworksType
): PackageJsonType["type"] => {
  switch (framework) {
    case "express":
      return "commonjs";
    case "svelte":
      return "module";
    default:
      return type;
  }
};

const processedPackageJson: ProcessPackageJsonType = ({
  packageJson: { name, license, version, scripts, ...packageJson } = {
    name: "",
    license: "",
    version: "",
  },
  appsRootDir,
  repoType,
  packagesRootDir,
  framework,
  workspaceType,
  extraWorkspaces,
  root,
  deploy,
}) => {
  const deps = {
    dependencies: packageJson.dependencies,
    devDependencies: packageJson.devDependencies,
    peerDependencies: packageJson.peerDependencies,
    peerDependenciesMeta: packageJson.peerDependenciesMeta,
    bundleDependencies: packageJson.bundleDependencies,
    optionalDependencies: packageJson.optionalDependencies,
    bundledDependencies: packageJson.bundledDependencies,
  };
  return repoType === "monoRepo" && root
    ? {
        ...packageJson,
        name,
        version,
        license,
        private: true,
        scripts: {
          ...getScripts(),
          ...scripts,
        },
        workspaces: [
          `${appsRootDir}/*`,
          `${packagesRootDir}/*`,
          ...(extraWorkspaces || []),
        ],
        ...getDependencies({
          isMono: repoType === "monoRepo",
          ...deps,
        }),
      }
    : repoType === "monoRepo" && !root
    ? {
        ...packageJson,
        name,
        version,
        license,
        type: getPackageJosnType(packageJson.type, framework),
        scripts: {
          ...getScripts(framework, workspaceType === "package", deploy),
          ...scripts,
        },
        ...getDependencies({
          isMono: repoType === "monoRepo",
          framework,
          ...deps,
        }),
      }
    : {
        ...packageJson,
        name,
        version,
        license,
        type: getPackageJosnType(packageJson.type, framework),
        scripts: {
          ...getScripts(framework, workspaceType === "package", deploy),
          ...scripts,
        },
        ...getDependencies({
          isMono: repoType === "monoRepo",
          framework,
          ...deps,
        }),
      };
};

export const processPackageJson: ProcessPackageJsonType = (props) => {
  const packageJson = processedPackageJson(props);
  const packageJsonKeys = objectKeys(packageJson);
  for (const key of packageJsonKeys) {
    const value = packageJson[key];

    if (value) {
      if (typeof value === "object") {
        if (Array.isArray(value)) {
          if (value.length === 0) {
            delete packageJson[key];
          }
        } else {
          if (Object.keys(value).length === 0) {
            delete packageJson[key];
          }
        }
      }
    }
  }

  return packageJson;
};
