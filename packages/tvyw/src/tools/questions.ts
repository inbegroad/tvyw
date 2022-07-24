import type { QuestionCollection } from "inquirer";
import inquirer from "inquirer";
import path from "path";
import {
  frameworksEnum,
  repoTypeEnum as rt,
  workspaceTypeEnum as wt,
} from "../schemas";
import { WorkspaceType, FrameworksType, RepoType } from "../types/from-schema";
import { CallBack } from "../types/generics";
import {
  getFramewrkFromString,
  getRepoTypeFromString,
  getWorkspaceTypeFromString,
} from "./config-prop-from-string";
import { haveDependency } from "./have-dependency";
import { getValidName } from "./pkg-name";
import {
  WorkspaceDetailsType,
  getWorkspacesList,
  findWorkspaceByName,
  isWorkspace,
  WorkspacesListType,
} from "./workspaces-list";
type QuestionType<T, R> = CallBack<T, Promise<R>>;
// type QuestionType<T, R = T> = (args?: T) => Promise<R>;

const linkWorkspaces = async (
  packageName: string,
  workspaces?: WorkspacesListType
) => {
  let selectedWorkspaces: string[] = [];
  const wsl = workspaces || getWorkspacesList();
  const { workspaces: wss } = wsl;

  if (wss && wss.length > 0) {
    const question: QuestionCollection<{ selectedFramework: string[] }> = {
      type: "checkbox",
      name: "selectedFramework",
      message: "Select workspaces to link",
      choices: wss
        .filter((w) => w.isPackage && w.name !== packageName)
        .map((ws) => {
          return {
            name: ws.name,
            value: ws.name,
            key: ws.location,
          };
        }),
    };
    const { selectedFramework: sfws } = await inquirer.prompt(question);
    selectedWorkspaces = sfws;
  }
  return selectedWorkspaces;
};
const selectAWorkspace = async (
  filter?: (workspace: WorkspaceDetailsType) => boolean,
  workspaces?: WorkspacesListType
) => {
  const wsl = workspaces || getWorkspacesList();
  const { workspaces: wss } = wsl;
  if (wss && wss.length > 0) {
    let cho = wss;
    if (filter !== undefined) {
      cho = cho.filter((w) => filter(w));
    }
    const question: QuestionCollection<{ selectedWorkspace: string }> = {
      type: "list",
      name: "selectedWorkspace",
      message: "Select a workspace",
      choices: cho.map((ws) => ws.name),
    };
    const { selectedWorkspace: sfws } = await inquirer.prompt(question);
    return findWorkspaceByName(sfws, { ...wsl, workspaces: wss });
  }
  throw new Error("You have no workspaces to preform an actionn for");
};
const removeWorkspace = async (
  packageName?: string,
  workspaces?: WorkspacesListType
) => {
  let removed: WorkspaceDetailsType | undefined;
  const wsl = workspaces || getWorkspacesList();
  const { workspaces: wss } = wsl;
  if (wss && wss.length > 0) {
    if (packageName) {
      removed = wss.filter((w) => w.name === packageName)[0];
    } else {
      removed = await selectAWorkspace();
    }
  }

  return removed;
};
const addkWorkspaceDeps = async (
  packageName?: string,
  workspaces?: WorkspacesListType
) => {
  const wsl = workspaces || getWorkspacesList();

  const { workspaces: wss } = wsl;
  let toAdd: WorkspaceDetailsType | undefined;
  if (packageName === undefined) {
    toAdd = await selectAWorkspace();
  } else {
    toAdd = findWorkspaceByName(packageName, { ...wsl, workspaces: wss });
  }

  let added: string[] = [];

  const withDeps = wss.filter(
    (w) =>
      w.isPackage &&
      !haveDependency(w.name, toAdd?.packageJson.dependencies || {})
  );

  if (withDeps.length === 0) {
    console.log("This workspace has all dependencies installed");
    return;
  }

  if (withDeps.length > 0) {
    const question: QuestionCollection<{ added: string[] }> = {
      type: "checkbox",
      name: "added",
      message: `Select workspaces to add ${toAdd?.name} to`,

      choices: withDeps
        .filter((w) => w.isPackage && w.name !== toAdd?.name)
        .map((ws) => ({
          name: ws.name,
          value: ws.name,
          disabled: ws.name === packageName,
          key: ws.location,
        })),
    };
    const { added: sfws } = await inquirer.prompt(question);
    added = sfws;
  }

  return { targetInstalls: added, target: toAdd?.name };
};
const framework: QuestionType<[string | undefined], FrameworksType> = async (
  fwArg
) => {
  if (fwArg) return getFramewrkFromString(fwArg);
  const question: QuestionCollection<{ framework: FrameworksType }> = {
    name: "framework",
    type: "list",
    message: "What framework do you want to use?",
    choices: frameworksEnum,
    default: "vanilla" as FrameworksType,
  };
  const { framework } = await inquirer.prompt(question);
  return framework;
};
const packageName: QuestionType<
  [path.ParsedPath | undefined, string | undefined],
  string
> = async (parsedPath, pnArg) => {
  let retName = "";

  if (pnArg) retName = getValidName(pnArg);
  else {
    const question: QuestionCollection<{ packageName: string }> = {
      name: "packageName",
      type: "input",
      message: "package.json name?",
      default: getValidName(parsedPath?.name || ""),
      transformer(input) {
        return getValidName(input);
      },
      validate: (input) => input && input.length !== 0,
    };
    const { packageName } = await inquirer.prompt(question);

    retName = packageName;
  }
  return retName;
};
const install: QuestionType<[boolean | undefined], boolean> = async (inArg) => {
  if (inArg) return inArg;
  const question: QuestionCollection<{ install: boolean }> = {
    name: "install",
    type: "confirm",
    message: "Do you want to install dependencies?",
    default: false,
  };
  const { install } = await inquirer.prompt(question);
  return install;
};
const overwrite: QuestionType<[boolean | undefined], boolean> = async (
  ovArg
) => {
  if (ovArg) return ovArg;
  const question: QuestionCollection<{ overwrite: boolean }> = {
    name: "overwrite",
    type: "confirm",
    message: "Project directory is not empty, do you want to overwrite it?",
    default: false,
  };
  const { overwrite } = await inquirer.prompt(question);
  return overwrite;
};
const repoType: QuestionType<[string | undefined], RepoType> = async (
  fwArg
) => {
  if (fwArg) return getRepoTypeFromString(fwArg);
  const question: QuestionCollection<{ repoType: RepoType }> = {
    name: "repoType",
    type: "list",
    message: "What type of repository do you want to use?",
    choices: rt,
    default: "single" as RepoType,
  };
  const { repoType } = await inquirer.prompt(question);
  return repoType;
};
const workspaceType: QuestionType<[string | undefined], WorkspaceType> = async (
  fwArg
) => {
  if (fwArg) return getWorkspaceTypeFromString(fwArg);
  const question: QuestionCollection<{
    workspaceType: WorkspaceType;
  }> = {
    name: "workspaceType",
    type: "list",
    message: "What type of workspace do you want to use?",
    choices: wt,
    default: "app" as WorkspaceType,
  };
  const { workspaceType } = await inquirer.prompt(question);
  return workspaceType;
};

const workspaceName: QuestionType<
  [string | undefined, ((filter: WorkspaceDetailsType) => boolean) | undefined],
  string
> = async (namArg, filter) => {
  const question: QuestionCollection<{
    name: string;
  }> = {
    name: "name",
    type: "list",
    message: "Select a workspace?",
    choices: getWorkspacesList().workspaces.filter((ws) =>
      filter ? filter(ws) : ws
    ),
  };
  if (namArg !== undefined) {
    if (isWorkspace(namArg)) return namArg;
    const { name } = await inquirer.prompt(question);
    return name;
  } else {
    const { name } = await inquirer.prompt(question);
    return name;
  }
};
const version: QuestionType<[string, string | undefined], string> = async (
  name,
  version
) => {
  const question: QuestionCollection<{
    version: string;
  }> = {
    name: "version",
    type: "input",
    message: `${name} version is ${
      version === undefined ? "0.0.0" : version
    }, edit to the new version`,
  };

  const { version: vr } = await inquirer.prompt(question);
  return vr;
};

export const questionsMonoList = {
  framework,
  install,
  overwrite,
  packageName,
  repoType,
  workspaceName,
  workspaceType,
  removeWorkspace,
  linkWorkspaces,
  addkWorkspaceDeps,
  selectAWorkspace,
  version,
};
