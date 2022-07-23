import https from "https";
import { getVersionConfig } from "./version-config";

export function checkForLatestVersion() {
  const { name } = getVersionConfig();
  return new Promise((resolve, reject) => {
    https
      .get(`https://registry.npmjs.org/-/package/${name}/dist-tags`, (res) => {
        if (res.statusCode === 200) {
          let body = "";
          res.on("data", (data) => (body += data));
          res.on("end", () => {
            resolve(JSON.parse(body).latest);
          });
        } else {
          reject();
        }
      })
      .on("error", () => {
        reject();
      });
  });
}
