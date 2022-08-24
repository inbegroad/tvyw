import { join, parse } from "path";
import { PackageJsonType, RepoType } from "../../types/from-schema";
import { Graph } from "../graph/graph";
import { Queue } from "../graph/queue";
import { resolveConfigsFromProjects } from "./resolve-config";
import { IWorkspace, WorkspaceDetailsType, WorkspaceMapType } from "./types";

export class WorkspacesMap implements IWorkspace {
  private map: WorkspaceMapType;
  private locationMap: WorkspaceMapType;
  private nameLocationMap: Map<string, string>;
  private internalRepoType: RepoType;
  private mapArray: WorkspaceDetailsType[];
  private depsGraph: Graph<string>;
  // private internalExcutionMap: ExcutionMap;
  private excutionQueue: Queue<string>;
  constructor() {
    this.map = resolveConfigsFromProjects();
    this.locationMap = new Map();
    this.nameLocationMap = new Map();
    this.map.forEach((ws) => {
      this.locationMap.set(ws.location, ws);
      this.nameLocationMap.set(ws.name, ws.location);
    });
    this.internalRepoType = this.getRoot().projMan.repoType;
    this.depsGraph = new Graph();
    this.mapArray = [];
    if (this.internalRepoType === "monoRepo") {
      this.mapArray = [...this.map.values()];
      // this.internalExcutionMap = new ExcutionMap(
      //   this.mapArray.map(({ name }) => name)
      // );
      for (const {
        name,
        packageJson: { dependencies },
      } of this.workspacesList) {
        const keys = Object.keys(dependencies || {}).filter((k) =>
          this.isWorkspace(k)
        );
        this.depsGraph.addVertex(name);
        for (const key of keys) {
          this.depsGraph.addEdge(name, key);
        }
      }
    }
    this.excutionQueue = Graph.graphToQueue(this.depsGraph);
  }
  get size() {
    return this.internalRepoType === "single" ? 1 : this.map.size - 1;
  }
  isCustom(workspace: WorkspaceDetailsType) {
    return (
      (workspace.projMan.repoType === "single" &&
        workspace.projMan.framework === "custom") ||
      (workspace.projMan.repoType === "monoRepo" &&
        !workspace.projMan.root &&
        workspace.projMan.framework === "custom")
    );
  }
  get repoType() {
    return this.internalRepoType;
  }
  isDependencyOf(name: string, target: string) {
    return (
      this.findByName(target)?.packageJson.dependencies?.[name] !== undefined
    );
  }
  getRoot() {
    const root = this.map.get("root");
    if (!root) throw new Error("No root level configuration file found");
    else return root;
  }
  findByName(name?: string) {
    if (name) return this.map.get(name);
  }
  findByLocation(location: string) {
    return this.locationMap.get(location);
  }
  getLocationByName(name: string) {
    return this.nameLocationMap.get(name);
  }
  isAvailableName(name: string) {
    return this.findByName(name) === undefined;
  }
  isWorkspace(name: string) {
    return !this.isAvailableName(name);
  }
  isAvailableLocation(location: string) {
    return this.findByLocation(location) === undefined;
  }
  isSameLocation(anyLocation: string, distLocation: string) {
    const loc = parse(anyLocation);
    const loca = join(loc.dir.replace(/\\/g, "/"), loc.name);
    const locSrc = parse(distLocation);
    const locaSrc = join(loc.dir.replace(/\\/g, "/"), locSrc.name);
    return loca === locaSrc;
  }
  getConfigFiles(name: string) {
    const ws = this.findByName(name);
    if (ws) {
      return {
        packageJson: ws.packageJson,
        tsconfig: ws.tsconfig,
        projMan: ws.projMan,
      };
    } else throw new Error(`Package ${name} not found`);
  }
  isDependenciesWorkspace(deps: PackageJsonType["dependencies"]) {
    const ret: string[] = [];
    if (deps) {
      const depskk = Object.keys(deps);
      for (const ws of depskk) {
        const found = this.workspacesList.find((w) => w.name === ws);
        if (found) {
          ret.push(found.name);
        }
      }
      // re
    }
    return ret;
  }
  get workspacesList() {
    if (this.internalRepoType === "single")
      throw new Error(
        "Some hook tried to get workspacesList on a single project\nplease check your config or cwd"
      );
    return this.mapArray.filter((w) => w.name !== "root");
  }
  get queue() {
    if (this.internalRepoType === "single")
      throw new Error(
        "Some hook tried to get excutionQueue on a single project\nplease check your config or cwd"
      );
    return this.excutionQueue;
  }
}
