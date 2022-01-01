"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const follow_redirects_1 = require("follow-redirects");
class InstallTool {
    static installed() {
        return new Promise((resolve) => resolve(fs.existsSync(this.file)));
    }
    static install() {
        return new Promise((resolve) => {
            follow_redirects_1.https.get(this.uri, (res) => {
                const stream = fs.createWriteStream(this.file);
                res.pipe(stream);
                stream.on('finish', () => {
                    stream.close();
                    fs.chmodSync(this.file, 0o755);
                    resolve();
                });
            });
        });
    }
}
exports.default = InstallTool;
;
