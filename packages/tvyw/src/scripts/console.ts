import nodeConsole, { Console } from "console";
import colors from "picocolors";
import { Formatter } from "picocolors/types";
import { InspectOptions } from "util";
import { ProjManCmdType, RepoType } from "../types/from-schema";

export const createConsole = (
  name: string,
  cmd: ProjManCmdType,
  repoType: RepoType,
  justName = false,
  appended = ""
): Console => {
  if (repoType === "single") return nodeConsole;
  return {
    ...nodeConsole,
    log<T>(message?: T, ...optionalParams: unknown[]) {
      console.log(
        getLabel({
          name,
          cmd,
          justName,
          appended,
          message,
        }),
        ...optionalParams
      );
    },
    countReset(message) {
      console.countReset(getLabel({ name, cmd, justName, appended, message }));
    },
    count(message) {
      console.count(getLabel({ name, cmd, justName, appended, message }));
    },
    time(message) {
      console.time(getLabel({ name, cmd, justName, appended, message }));
    },
    assert<T>(value: T, message?: string, ...optionalParams: unknown[]) {
      console.assert(
        value,
        getLabel({ isNewLine: true, name, cmd, justName, appended, message }),
        ...optionalParams
      );
    },
    debug<T>(message?: T, ...optionalParams: unknown[]) {
      console.debug(
        getLabel({ name, cmd, justName, appended, message }),
        ...optionalParams
      );
    },
    dir<T>(obj: T, options?: InspectOptions) {
      console.log(getLabel({ name, cmd, justName, appended }));
      console.dir(obj, options);
    },
    dirxml(...data: unknown[]) {
      console.log(getLabel({ name, cmd, justName, appended }));
      console.dirxml(...data);
    },
    error<T>(message?: T, ...optionalParams: unknown[]) {
      console.error(
        getLabel({
          isNewLine: true,
          name,
          cmd,
          justName,
          appended,
          message,
          color: colors.red,
        }),
        optionalParams
      );
    },
    groupCollapsed(...label) {
      console.log(getLabel({ name, cmd, justName, appended }));
      console.groupCollapsed(...label);
    },
    info<T>(message?: T, ...optionalParams: unknown[]) {
      console.info(
        getLabel({
          name,
          cmd,
          justName,
          appended,
          message,
          color: colors.cyan,
        }),
        ...optionalParams
      );
    },
    group(...label) {
      console.log(getLabel({ name, cmd, justName, appended }));
      console.group(...label);
    },
    profile(message) {
      console.profile(getLabel({ name, cmd, justName, appended, message }));
    },
    profileEnd(message) {
      console.profileEnd(getLabel({ name, cmd, justName, appended, message }));
    },
    table(tabularData, properties) {
      console.log(getLabel({ name, cmd, justName, appended }));
      console.table(tabularData, properties);
    },
    timeEnd(message) {
      console.timeEnd(getLabel({ name, cmd, justName, appended, message }));
    },
    timeLog(message, ...data: unknown[]) {
      console.timeLog(
        getLabel({ name, cmd, justName, appended, message }),
        ...data
      );
    },
    timeStamp(message) {
      console.timeStamp(getLabel({ name, cmd, justName, appended, message }));
    },
    trace<T>(message?: T, ...optionalParams: unknown[]) {
      console.trace(
        getLabel({ name, cmd, justName, appended, message }),
        ...optionalParams
      );
    },
    warn<T>(message?: T, ...optionalParams: unknown[]) {
      console.warn(
        getLabel({
          isNewLine: true,
          name,
          cmd,
          justName,
          appended,
          message,
          color: dimRed,
        }),
        ...optionalParams
      );
    },
  };
};
function dimRed(color: Parameters<Formatter>[0]) {
  return colors.dim(colors.red(color));
}
type GetLabelProps<T> = {
  color?: Formatter;
  name: string;
  cmd: ProjManCmdType;
  justName: boolean;
  appended: string;
  isNewLine?: boolean;
  message?: T;
};
export function getLabel<T>({
  appended,
  cmd,
  color,
  justName,
  name,
  message,
  isNewLine,
}: GetLabelProps<T>) {
  if (message) {
    const sep = isNewLine ? "\n" : "";
    const jName = !justName ? `-${cmd}` : "";
    if (color)
      return `${sep}[${color(
        `${name}-${appended}${jName}`
      )}] => ${message}${sep}`;
    return `${sep}[${name}-${appended}${jName}] => ${message}${sep}`;
  }
}
