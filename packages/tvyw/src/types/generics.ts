export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T extends undefined
  ? never
  : T;
export type DeepRequired<T> = {
  [P in keyof T]-?: DeepRequired<NonNullable<T[P]>>;
};
export type RecordType<T = string> = Record<string, T>;

export type CallBack<A = unknown[], B = unknown> = (
  ...args: A extends unknown[] ? A : [A]
) => B;
export type UnknownIfEmpty<T> = keyof T extends never ? unknown : T;

export type StringIfEmpty<T> = keyof T extends never ? string : T;
export type TIfEmpty<T, G> = keyof T extends never ? T : G;

export type TypeWithGeneric<T> = T extends unknown[] ? T[] : never;
export type ExtractGeneric<Type> = Type extends TypeWithGeneric<infer X>
  ? X
  : never;
