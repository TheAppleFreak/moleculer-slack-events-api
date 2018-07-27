"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const os_1 = tslib_1.__importDefault(require("os"));
const pkg = require("../package.json");
function packageIdentifier() {
    return `${pkg.name.replace("/", ":")}/${pkg.version} ${os_1.default.platform()}/${os_1.default.release()} node/${process.version.replace("v", "")}`;
}
exports.packageIdentifier = packageIdentifier;
