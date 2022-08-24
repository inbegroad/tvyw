import { AddressInfo, Server } from "net";
import os from "os";
import colors from "picocolors";
import { CommonServerOptions, ResolvedConfig, Logger } from "vite";

type Hostname = {
  host: string | undefined;
  name: string;
};

export function printCommonServerUrls(
  server: Server | null,
  options: CommonServerOptions,
  config: ResolvedConfig
): void {
  if (server) {
    const address = server.address();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isAddressInfo = (x: any): x is AddressInfo => x?.address;
    if (isAddressInfo(address)) {
      const hostname = resolveHostname(options.host);
      const protocol = options.https ? "https" : "http";
      printServerUrls(
        hostname,
        protocol,
        address.port,
        config.base,
        config.logger.info
      );
    }
  }
}

function printServerUrls(
  hostname: Hostname,
  protocol: string,
  port: number,
  base: string,
  info: Logger["info"]
): void {
  if (hostname.host === "127.0.0.1") {
    const url = `${protocol}://${hostname.name}:${colors.bold(port)}${base}`;
    info(`  Local: ${colors.cyan(url)}`);
    if (hostname.name !== "127.0.0.1") {
      info(`  Network: ${colors.dim("use `--host` to expose")}`);
    }
  } else {
    Object.values(os.networkInterfaces())
      .flatMap((nInterface) => nInterface ?? [])
      .filter((detail) => detail && detail.address && detail.family === "IPv4")
      .map((detail) => {
        const type = detail.address.includes("127.0.0.1")
          ? "Local:   "
          : "Network: ";
        const host = detail.address.replace("127.0.0.1", hostname.name);
        const url = `${protocol}://${host}:${colors.bold(port)}${base}`;
        return `  > ${type} ${colors.cyan(url)}`;
      })
      .forEach((msg) => info(msg));
  }
}

function resolveHostname(optionsHost: string | boolean | undefined): Hostname {
  let host: string | undefined;
  if (optionsHost === undefined || optionsHost === false) {
    // Use a secure default
    host = "127.0.0.1";
  } else if (optionsHost === true) {
    // If passed --host in the CLI without arguments
    host = undefined; // undefined typically means 0.0.0.0 or :: (listen on all IPs)
  } else {
    host = optionsHost;
  }

  // Set host name to localhost when possible, unless the user explicitly asked for '127.0.0.1'
  const name =
    (optionsHost !== "127.0.0.1" && host === "127.0.0.1") ||
    host === "0.0.0.0" ||
    host === "::" ||
    host === undefined
      ? "localhost"
      : host;

  return { host, name };
}
