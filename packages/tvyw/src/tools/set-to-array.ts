class Settify<T> extends Set<T> {
  constructor(targets?: T[]) {
    super(targets || []);
  }
  get array() {
    return [...this];
  }
  get length() {
    return this.size;
  }
}

export const dedupArray = <T>(...targets: Array<T>) => {
  const res: Settify<T> = new Settify(targets);

  return res.length === 0 ? undefined : res.array;
};
