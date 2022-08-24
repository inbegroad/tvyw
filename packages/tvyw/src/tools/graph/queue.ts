import { LinkedList } from "./linked-list";

export class Queue<T extends string | number | symbol> {
  list: LinkedList<T>;
  constructor() {
    this.list = new LinkedList<T>();
  }
  enqueue(value: T) {
    if (!this.list.has(value)) this.list.append(value);
  }
  dequeue() {
    return this.list.removeFromFront();
  }
  has(value: T) {
    return this.list.has(value);
  }
  peek() {
    return this.list.head?.value;
  }
  isEmpty() {
    return this.list.isEmpty();
  }
  getSize() {
    return this.list.getSize();
  }
  print() {
    return this.list.print();
  }
  get() {
    return this.list.get();
  }
}
