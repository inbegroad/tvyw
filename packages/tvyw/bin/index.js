#!/usr/bin/env node

const commander = require("commander");
const { version, name } = require("../package.json");
const {
  run,
  projManCmdEnum,
  frameworksEnum,
  remove,
  add,
  addWorkspace,
  workspaceTypeEnum,
  install,
  focus,
  deploy,
} = require("..");

const program = new commander.Command(name)
  .description("Run a script")
  .version(version)
  .argument("[cmd]", `Command: ${projManCmdEnum.join(" | ")} `, "dev")
  .action(run);

program
  .command("deploy")
  .description("Deploy to npm")
  .version(version)
  .argument("[name]", "Name of the package")
  .action(deploy);

program
  .command("add-workspace")
  .description("Add a new workspace")
  .version(version)
  .argument("[name]", "packageName")
  .option(
    "-f, --framework <framework>",
    `Framework to use: ${frameworksEnum.join(" | ")} `
  )
  .option(
    "-wt, --workspace-type <type>",
    `Create a library project: ${workspaceTypeEnum.join(" | ")} `
  )
  .action(addWorkspace);

program
  .command("add-deps")
  .description("Install workspaces as dependencies to a workpace")
  .version(version)
  .argument("[name]", "The name of the project to add packages for")
  .action(add);

program
  .command("install")
  .description("Install to a workspace")
  .version(version)
  .argument("<packages>", "Npm packages you want to install")
  .option("-a, --args [args]", "Arguments to pass to yarn add")
  .option("-i, --install-to [inatallTo]", "Where to install the packages")
  .action(install);

program
  .command("focus")
  .description("Run script in a workspace")
  .version(version)
  .argument("<cmd>", "Run script in a workspace")
  .action(focus);

program
  .command("remove-workspace")
  .description("Remove a workspace")
  .version(version)
  .argument("[name]", "The name of the project to remove")
  .action(remove);

program.parse(process.argv);
