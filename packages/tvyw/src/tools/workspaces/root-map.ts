export class RootMap<K> extends Map<string, K> {
  constructor() {
    super();
  }
  setRoot(value: K) {
    this.set("root", value);
  }
  getRoot() {
    const root = this.get("root");
    if (typeof root === "undefined") throw new Error("Project root not found");
    return root;
  }
}
