import { execute } from "@yarnpkg/shell";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join, resolve } from "path";
import { Plugin } from "rollup";
import { gitignoreTemplate, npmignoreTemplate } from "./templates";

type VersionJson = {
  name: string;
  version: string;
  source: string;
  dev: boolean;
};

const scripts = {
  build: "rollup -c",
  dev: "yarn rollup -c -w",
};
// const scripts = {
//   build:
//     'yarn tsc --build --clean && concurrently "yarn rollup -c" "yarn tsc --build"',
//   dev: 'yarn tsc --build --clean && concurrently "yarn rollup -c -w" "yarn tsc --build -w"',
// };

const vConfigFilePath = resolve("../tvyw/src/version.json");
export const run = async (cmd: string) => {
  const versionJson: VersionJson = JSON.parse(
    readFileSync(resolve(vConfigFilePath), "utf8")
  );
  if (cmd === "dev" || cmd === "build") {
    const pkgJaon = JSON.parse(
      readFileSync(join(process.cwd(), "package.json"), "utf8")
    );
    console.log(`Running ${cmd} on ${pkgJaon.name}`);

    if (versionJson.name === pkgJaon.name) {
      versionJson.version = pkgJaon.version;
      writeFileSync(vConfigFilePath, JSON.stringify(versionJson, null, 2));
      await execute(scripts[cmd]);
    }
  } else if (cmd === "deploy") {
    deploy();
  } else throw new Error(`Command ${cmd} is not supported`);
};

async function deploy() {
  const versionJson: VersionJson = JSON.parse(
    readFileSync(resolve(vConfigFilePath), "utf8")
  );
  const pkgJsonPath = resolve(`package.json`);
  const pkgJson = JSON.parse(readFileSync(pkgJsonPath, "utf8"));

  const cachedPath = join(
    process.cwd(),
    "..",
    "..",
    "node_modules",
    `.cache/${versionJson.name}/${pkgJson.name}`
  );

  if (!existsSync(cachedPath)) mkdirSync(cachedPath, { recursive: true });
  const cachedFilePath = join(cachedPath, `${pkgJson.name}.temp.json`);

  writeFileSync(cachedFilePath, JSON.stringify(pkgJson, null, 2));
  delete pkgJson.scripts;
  delete pkgJson.devDependencies;
  writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2));
  await execute("npm publish");
  const temp = JSON.parse(readFileSync(cachedFilePath, "utf8"));
  writeFileSync(pkgJsonPath, JSON.stringify(temp, null, 2));
}

export function build(): Plugin {
  const versionJson: VersionJson = JSON.parse(
    readFileSync(resolve(vConfigFilePath), "utf8")
  );
  return {
    name: `rollup-plugin-${versionJson.name}`,
    async buildStart() {
      const pkgJsonPath = resolve(`../create-${versionJson.name}/package.json`);
      const pkgJaon = JSON.parse(readFileSync(pkgJsonPath, "utf8"));
      const isDev =
        process.argv.includes("-w") || process.argv.includes("--watch");

      if (pkgJaon.name !== versionJson.name) {
        pkgJaon.dependencies[versionJson.name] = isDev
          ? "workspace:^"
          : versionJson.version;
        writeFileSync(pkgJsonPath, JSON.stringify(pkgJaon, null, 2));
      }
    },
  };
}

type IgnoreFilesProps = {
  rootDir: string;
  dirName: string;
  packageName: string;
  deploy?: boolean;
  buildDir?: string;
  declarationDir?: string;
  entriesDir?: string;
  typeSource?: string;
  npmIgnorePath?: string;
}[];

type IgnoreFiles = (props: IgnoreFilesProps) => Plugin;
export const ignoreFiles: IgnoreFiles = function (props) {
  const versionJson: VersionJson = JSON.parse(
    readFileSync(resolve(vConfigFilePath), "utf8")
  );
  return {
    name: `rollup-plugin-ignore-files`,
    async buildStart() {
      const gitIgnorePath = resolve(
        join(process.cwd(), "..", "..", ".gitignore")
      );
      let gitignore = `${gitignoreTemplate}\n${versionJson.name}.ts`;
      let propsBuildDir = "";
      let propsDeclarationDir = "";
      let propsTemp = "";
      let srcDec = "";
      for (const {
        buildDir = "dist",
        declarationDir = "types",
        entriesDir = "src",
        packageName,
        dirName,
        rootDir,
        deploy = true,
        typeSource = "types",
        npmIgnorePath = join(process.cwd(), ".npmignore"),
      } of props) {
        const npmignore = `${npmignoreTemplate}\n${versionJson.name}.ts\n${entriesDir}\nrollup.config.js`;
        propsBuildDir = `${propsBuildDir}\n${join(rootDir, dirName, buildDir)}`;
        propsDeclarationDir = `${propsDeclarationDir}\n${join(
          rootDir,
          dirName,
          declarationDir
        )}`;
        srcDec = `${srcDec}\n!${join(
          rootDir,
          dirName,
          entriesDir,
          typeSource
        )}`;
        propsTemp = `${propsTemp}\nnode_modules/.cache/${versionJson.name}/${packageName}/${packageName}.temp.json`;
        if (deploy) {
          writeFileSync(npmIgnorePath, npmignore.replace(/\\/g, "/"));
        }
      }
      gitignore = `${gitignore}\n${propsBuildDir}\n${propsDeclarationDir}\n${srcDec}\n${propsTemp}`;
      writeFileSync(gitIgnorePath, gitignore.replace(/\\/g, "/"));
    },
  };
};
