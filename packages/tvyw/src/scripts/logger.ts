import { createLogger, Logger } from "vite";
import { ProjManCmdType } from "../types/from-schema";
import { getLabel } from "./console";
import colors from "picocolors";
import { Formatter } from "picocolors/types";

export const createCustomLogger = (
  name: string,
  cmd: ProjManCmdType
): Logger => {
  const nLogger = createLogger();
  function getMsg(message: string, color: Formatter, isNewLine = true) {
    return getLabel({
      name,
      cmd,
      justName: false,
      appended: "Vite",
      message,
      isNewLine,
      color,
    });
  }
  const noNewLine = (message: string) =>
    message.includes("\n") ? message.replace("\n", "") : message;
  return {
    ...nLogger,

    warnOnce(msg, options) {
      const newMsg = noNewLine(msg);
      nLogger.warnOnce(getMsg(newMsg, colors.yellow) || "", options);
    },
    warn(msg, options?) {
      const newMsg = noNewLine(msg);
      nLogger.warn(getMsg(newMsg, colors.yellow) || "", options);
    },
    error(msg, options?) {
      const newMsg = noNewLine(msg);
      nLogger.error(getMsg(newMsg, colors.red) || "", options);
    },
    info(msg, options?) {
      const newMsg = noNewLine(msg);
      nLogger.info(getMsg(newMsg, colors.cyan, false) || "", options);
    },
  };
};
