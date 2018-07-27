import os from "os";
const pkg = require("../package.json");

export function packageIdentifier(): string {
    return `${pkg.name.replace("/", ":")}/${pkg.version} ${os.platform()}/${os.release()} node/${process.version.replace("v", "")}`;
}