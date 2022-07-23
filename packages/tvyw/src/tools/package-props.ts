import { isPackagableEnum, canWebAppEnum } from "../schemas";
import { FrameworksType } from "../types/from-schema";

export const isPackagable = (framework: FrameworksType) =>
  isPackagableEnum.find((f) => f === framework) !== undefined;

export const isWebApp = (framework: FrameworksType) =>
  canWebAppEnum.find((f) => f === framework) !== undefined;
