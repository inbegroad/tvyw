import { BuildsType } from "./types";

export class ExcutionMap extends Map<string, BuildsType> {
  private internalJson: Record<string, BuildsType>;
  private deps: string[];
  constructor(deps: string[]) {
    super();
    this.deps = deps;
    this.internalJson = {};
    this.init();
  }

  init() {
    this.deps.forEach((name) => {
      this.set(name);
    });
  }
  get json() {
    return this.internalJson;
  }

  set(key: string, value: Partial<BuildsType> = {}): this {
    const newVal: BuildsType = {
      vite: value.vite || this.get(key)?.vite || false,
      types: value.types || this.get(key)?.vite || false,
    };
    this.internalJson[key] = newVal;
    return super.set(key, newVal);
  }
}
