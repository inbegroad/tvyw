class LinkedListNode<T extends string | number | symbol> {
  value: T;
  next: LinkedListNode<T> | null;
  constructor(value: T) {
    this.value = value;
    this.next = null;
  }
}
export class LinkedList<T extends string | number | symbol> {
  head: LinkedListNode<T> | null;
  tail: LinkedListNode<T> | null;
  size: number;
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  isEmpty() {
    return this.size === 0;
  }

  getSize() {
    return this.size;
  }

  prepend(value: T) {
    const node = new LinkedListNode<T>(value);
    if (this.isEmpty()) {
      this.head = node;
      this.tail = node;
    } else {
      node.next = this.head;
      this.head = node;
    }
    this.size++;
  }

  append(value: T) {
    const node = new LinkedListNode<T>(value);
    if (this.isEmpty()) {
      this.head = node;
      this.tail = node;
    } else {
      if (this.tail) {
        this.tail.next = node;
        this.tail = node;
      }
    }
    this.size++;
  }
  removeFromFront() {
    if (this.isEmpty()) {
      return null;
    }
    const value = this.head?.value;
    if (this.head?.next) {
      this.head = this.head.next;
    }
    this.size--;
    return value;
  }

  removeFromEnd() {
    if (this.isEmpty()) {
      return null;
    }
    const value = this.tail?.value;
    if (this.size === 1) {
      this.head = null;
      this.tail = null;
    } else {
      let prev = this.head;
      while (prev?.next !== this.tail) {
        if (prev?.next) {
          prev = prev.next;
        }
      }
      prev.next = null;
      this.tail = prev;
    }
    this.size--;
    return value;
  }

  reverse() {
    let current = this.head;
    let prev = null;
    let next = null;
    while (current) {
      next = current.next;
      current.next = prev;
      prev = current;
      current = next;
    }
    this.tail = this.head;
    this.head = prev;
  }
  has(value: T) {
    let curr = this.head;
    while (curr) {
      if (curr.value === value) {
        return true;
      }
      curr = curr.next;
    }
    return false;
  }
  get() {
    if (this.isEmpty()) {
      return;
    } else {
      let curr = this.head;
      const list: T[] = [];
      while (curr) {
        list.push(curr.value);
        curr = curr.next;
      }
      return list;
    }
  }
  print() {
    console.log(this.get()?.toString().replace(/,/g, " => "));
  }
}
