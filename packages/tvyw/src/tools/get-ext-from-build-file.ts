export const getExtFromBuildFile = (format: string) =>
  format === "cjs" ? ".js" : `.${format}.js`;
