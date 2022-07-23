import yarn from "@yarnpkg/shell";
import child from "child_process";

const checkYarn = async () => {
  try {
    child.execSync("yarn -v").toJSON();
  } catch (_e) {
    throw new Error(
      "Yarn is not installed in your system, please run 'npm install -g yarn'"
    );
  }
};

export const initYarn = async (mono: boolean, root: string) => {
  process.chdir(root);
  await checkYarn();
  console.log();
  console.log();
  console.log("Upgrading yarn to berry ...");
  console.log();
  console.log();
  await yarn.execute("yarn set version berry");
  await yarn.execute("yarn config set nodeLinker node-modules");
  console.log();
  console.log();
  console.log("Initilizing project ...");
  console.log();
  console.log();
  await yarn.execute(mono ? "yarn init -w" : "yarn init -y");
  if (mono) {
    yarn.execute("yarn plugin import workspace-tools");
  }

  console.log();
  console.log();
  console.log("Initilizating git");
  console.log();
  console.log();
  await yarn.execute("git init");
  console.log();
  console.log();

  console.log();
  console.log();
  console.log("Project now initilized");
  console.log();
  console.log();
};
