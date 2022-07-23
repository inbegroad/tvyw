export function isValidPackageName(projectName: string) {
  return /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(
    projectName
  );
}
function toValidPackageName(projectName: string) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/^[._]/, "")
    .replace(/@[^a-z0-9-~]+/g, "-");
}

export const getValidName = (src: string) =>
  isValidPackageName(src) ? src : toValidPackageName(src);
