import version from "../version.json";

export const getVersionConfig = () =>
  version as {
    name: string;
    version: string;
    source: string;
    dev: boolean;
  };
