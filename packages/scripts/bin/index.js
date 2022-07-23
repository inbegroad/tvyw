#!/usr/bin/env node

const commander = require("commander");
const program = new commander.Command("scripts");
const scripts = require("../");

program
  .version("0.0.1")
  .argument("[command]", "command to run", "dev")
  .argument(
    "[args]",
    'args "major, minor, patch" passed to deploy command',
    "patch"
  )
  .action(scripts.run)
  .parse(process.argv);
