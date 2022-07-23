#!/usr/bin/env node

const commander = require("commander");
const { name, version } = require("./package.json");
const {
  frameworksEnum,
  workspaceTypeEnum,
  repoTypeEnum,
  // workspaceStructureEnum,
  createProject,
} = require("tvyw");

const program = new commander.Command(name);

program
  .version(version)
  .argument("[root]", "root directory: default to cwd", ".")
  .option(
    "-f, --framework <framework>",
    `Framework to use: ${frameworksEnum.join(" | ")} `
  )
  .option("-pn, --package-name <name>", "Package name")
  .option("-i, --install", "Install dependencies", false)
  .option("-o, --overwrite", "Overwrite existing directory")
  .option(
    "-wt, --workspace-type <type>",
    `Create a library project: ${workspaceTypeEnum.join(" | ")} `
  )
  .option(
    "-t, --repo-type <type>",
    `Create a monoRepo project: ${repoTypeEnum.join(" | ")} `
  )
  // .option(
  //   "-wss, --workspace-structure <workspaceStructure>",
  //   `Configure a script inside the project: ${workspaceStructureEnum.join(
  //     " | "
  //   )} `
  // )
  .action(createProject);

program.parse(process.argv);
