import fsExtra from "fs-extra";
import path from "path";

export function copy(src: string, dest: string) {
  const stat = fsExtra.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    fsExtra.copyFileSync(src, dest);
  }
}

function copyDir(srcDir: string, destDir: string) {
  fsExtra.mkdirSync(destDir, { recursive: true });
  for (const file of fsExtra.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copy(srcFile, destFile);
  }
}
