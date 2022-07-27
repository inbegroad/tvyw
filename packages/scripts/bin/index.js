#!/usr/bin/env node

const commander = require("commander");
const program = new commander.Command("scripts");
const scripts = require("../");

program
  .version("0.0.1")
  .argument("[command]", "command to run", "dev")
  .option(
    "-tv, --to-version [version]",
    "Change package version to publish to npm: major | minor | patch"
  )
  .action(scripts.run)
  .parse(process.argv);
