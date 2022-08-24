import { Queue } from "./queue";

export class Graph<T extends string | number | symbol> {
  adjacencyList: Map<T, Set<T>>;
  constructor() {
    this.adjacencyList = new Map<T, Set<T>>();
  }
  addVertex(vertex: T) {
    if (this.adjacencyList.get(vertex) === undefined) {
      this.adjacencyList.set(vertex, new Set());
    }
  }
  addEdgesSet(vertex: T, set: Set<T>) {
    if (this.adjacencyList.get(vertex) === undefined) {
      this.addVertex(vertex);
    } else {
      this.adjacencyList.set(vertex, set);
    }
  }
  addEdge(vertex1: T, vertex2: T) {
    if (vertex1 === vertex2) return;
    if (this.adjacencyList.get(vertex1) === undefined) {
      this.addVertex(vertex1);
    }
    if (this.adjacencyList.get(vertex2) === undefined) {
      this.addVertex(vertex2);
    }
    this.adjacencyList.get(vertex1)?.add(vertex2);
  }
  hasEdgeWith(name: T, target: T) {
    return this.adjacencyList.get(name)?.has(target);
  }
  static from<S extends string | number | symbol>(graph: Graph<S>): Graph<S> {
    const newGraph = new Graph<S>();
    graph.forEach((set, vertex) => {
      newGraph.addEdgesSet(vertex, set);
    });
    return newGraph;
  }
  private entries() {
    return [...this.adjacencyList.entries()];
  }
  hasEdge(vertex: T) {
    const ref = this.adjacencyList.get(vertex);
    return ref?.size !== 0 || false;
  }
  toArray() {
    return [...this.adjacencyList.keys()];
  }
  noEdgeAdjList() {
    return [...this.adjacencyList.entries()]
      .filter((itm) => itm[1].size === 0)
      .map((itm) => itm[0]);
  }
  get(vertex: T) {
    return this.adjacencyList.get(vertex);
  }

  isSelfDep(vertex: T) {
    return this.hasEdgeWith(vertex, vertex);
  }
  removeEdge(vertex1: T, vertex2: T) {
    this.adjacencyList.get(vertex1)?.delete(vertex2);
  }
  removeVertex(vertex: T) {
    const ref = this.adjacencyList.get(vertex);
    if (ref === undefined) return;
    for (const adjecentVertex of ref) {
      this.removeEdge(vertex, adjecentVertex);
    }
    this.adjacencyList.forEach((itm) => {
      if (itm.has(vertex)) {
        itm.delete(vertex);
      }
    });
    this.adjacencyList.delete(vertex);
  }
  forEach(
    callbackfn: (value: Set<T>, key: T, map: Map<T, Set<T>>) => void,
    thisArg?: unknown
  ): void {
    this.adjacencyList.forEach(callbackfn, thisArg);
  }
  print() {
    this.adjacencyList.forEach((_set, vertex) => {
      const vertexV = this.adjacencyList.get(vertex);
      if (vertexV) {
        if (typeof vertex === "string") {
          console.log(`${vertex} -> ${[...vertexV]}`);
        } else {
          console.log(`${vertex.toString()} -> ${[...vertexV]}`);
        }
      }
    });
  }
  get size() {
    return this.adjacencyList.size;
  }
  static graphToQueue<T extends string | number | symbol>(
    graph: Graph<T>,
    queue: Queue<T> = new Queue()
  ) {
    const internalGraph = Graph.from(graph);
    //   console.log("size is", internalGraph.size)
    while (internalGraph.size > 0) {
      internalGraph.forEach((values, key) => {
        if (values.size === 0) {
          queue.enqueue(key);
          internalGraph.removeVertex(key);
        } else {
          Graph.graphToQueue(internalGraph, queue);
        }
      });
    }
    return queue;
  }
}
