export type RecordType<T = string> = Record<string, T>;

export type CallBack<A = unknown[], B = unknown> = (
  ...args: A extends unknown[] ? A : [A]
) => B;
export type UnknownIfEmpty<T> = keyof T extends never ? unknown : T;

export type StringIfEmpty<T> = keyof T extends never ? string : T;
export type TIfEmpty<T, G> = keyof T extends never ? T : G;
