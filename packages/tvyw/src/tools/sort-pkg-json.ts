import { PackageJsonType } from "../types";

export const sortPkgJsonFile = ({
  name,
  license,
  version,
  packageManager,
  engines,
  type,
  main,
  module,
  exports,
  files,
  types,
  keywords,
  author,
  repository,
  description,
  maintainers,
  funding,
  os,
  peerDependenciesMeta,
  bundleDependencies,
  bundledDependencies,
  config,
  ava,
  contributors,
  directories,
  cpu,
  engineStrict,
  eslintConfig,
  esnext,
  jspm,
  dist,
  licenses,
  man,
  preferGlobal,
  prettier,
  publishConfig,
  readme,
  release,
  resolutions,
  stylelint,
  typesVersions,
  typings,
  bugs,
  homepage,
  bin,
  private: isPvt,
  dependencies,
  devDependencies,
  peerDependencies,
  optionalDependencies,
  scripts,
  workspaces,
  ...packageJson
}: PackageJsonType): PackageJsonType => ({
  //info
  // //project
  name,
  description,
  version,
  private: isPvt,
  license,
  licenses,
  readme,
  // //repo
  author,
  repository,
  bugs,
  homepage,
  keywords,
  funding,
  maintainers,
  contributors,
  publishConfig,
  release,
  // //env
  engines,
  packageManager,
  os,
  cpu,
  engineStrict,
  //config
  main,
  module,
  types,
  typings,
  bin,
  exports,
  files,
  directories,
  type,
  typesVersions,
  man,
  dist,
  workspaces,
  //js
  scripts,
  preferGlobal,
  config,
  eslintConfig,
  esnext,
  prettier,
  stylelint,
  jspm,
  dependencies,
  devDependencies,
  peerDependencies,
  optionalDependencies,
  bundleDependencies,
  bundledDependencies,
  peerDependenciesMeta,
  resolutions,
  //misc
  ava,
  ...packageJson,
});
