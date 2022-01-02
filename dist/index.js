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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bundler = void 0;
const AppImageTool_js_1 = __importDefault(require("./lib/AppImageTool.js"));
const LinuxDeploy_js_1 = __importDefault(require("./lib/LinuxDeploy.js"));
const Desktop_js_1 = __importDefault(require("./lib/Desktop.js"));
const AppRun_js_1 = __importDefault(require("./lib/AppRun.js"));
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
class Bundler {
    constructor(params) {
        this.appDir = path.join(__dirname, '../AppDir');
        this.params = params;
    }
    bundle() {
        return new Promise(async (resolve) => {
            if (!await AppImageTool_js_1.default.installed())
                await this.downloadAppImageTool();
            if (!await LinuxDeploy_js_1.default.installed())
                await this.downloadLinuxDeploy();
            if (fs.existsSync(this.appDir)) {
                console.log('Cleaning AppDir...');
                fs.removeSync(this.appDir);
            }
            console.log('Copying project files to AppDir...');
            fs.mkdirSync(this.appDir);
            fs.copyFileSync(path.join(this.params.binary.dist, this.params.binary.name, `${this.params.binary.name}-linux_x64`), path.join(this.appDir, this.params.binary.name));
            fs.copyFileSync(path.join(this.params.binary.dist, this.params.binary.name, 'resources.neu'), path.join(this.appDir, 'resources.neu'));
            fs.copyFileSync(this.params.desktop.icon, path.join(this.appDir, path.basename(this.params.desktop.icon)));
            if (this.params.copy) {
                Object.keys(this.params.copy).forEach((relative) => {
                    const relativePath = path.join(this.appDir, relative);
                    if (fs.lstatSync(this.params.copy[relative]).isDirectory())
                        fs.mkdirpSync(relativePath);
                    else
                        fs.createFileSync(relativePath);
                    fs.copySync(this.params.copy[relative], relativePath);
                });
            }
            console.log('Creating desktop file...');
            const imageName = /(.*)\.[^\.]*|([^\.]*)/.exec(path.basename(this.params.desktop.icon))[1];
            fs.writeFileSync(path.join(this.appDir, `${this.params.binary.name}.desktop`), Desktop_js_1.default.generate({
                name: this.params.desktop.name,
                icon: imageName,
                exec: `AppRun`,
                type: this.params.desktop.type,
                categories: this.params.desktop.categories
            }));
            console.log('Creating AppRun file...');
            fs.writeFileSync(path.join(this.appDir, 'AppRun'), AppRun_js_1.default.generate(`${this.params.binary.name}`));
            fs.chmodSync(path.join(this.appDir, 'AppRun'), 0o755);
            console.log('Executing LinuxDeploy...');
            let additionalOptions = [];
            if (this.params.includeLibraries)
                additionalOptions = ['-e', path.join(this.appDir, this.params.binary.name)];
            // /linuxdeploy --appdir AppDir -d AppDir/app.desktop -i '[...]/test/public/icons/64x64.png' [-e AppDir/app] -o appimage
            const linuxDeployProcess = (0, child_process_1.spawn)(LinuxDeploy_js_1.default.file, [
                '--appdir', this.appDir,
                '-d', path.join(this.appDir, `${this.params.binary.name}.desktop`),
                '-i', this.params.desktop.icon,
                ...additionalOptions,
                '-o', 'appimage'
            ], {
                env: {
                    ...process.env,
                    VERSION: this.params.version
                }
            });
            linuxDeployProcess.stdout.on('data', (data) => console.log(data.toString()));
            linuxDeployProcess.stdout.on('data', (data) => console.log(data.toString()));
            linuxDeployProcess.on('close', () => {
                if (this.params.libraries) {
                    console.log('Copying libraries...');
                    for (const library of this.params.libraries)
                        fs.copySync(path.join('/usr', 'lib', library), path.join(this.appDir, 'usr', 'lib', library));
                }
                const filesBefore = fs.readdirSync('.').filter((file) => file.substring(file.length - 9) === '.AppImage');
                console.log('Executing AppImageTool...\r\n');
                // ./appimagetool AppDir
                const appImageToolProcess = (0, child_process_1.spawn)(AppImageTool_js_1.default.file, [this.appDir]);
                appImageToolProcess.stdout.on('data', (data) => console.log(data.toString()));
                appImageToolProcess.stdout.on('data', (data) => console.log(data.toString()));
                appImageToolProcess.on('close', () => {
                    console.log('Project building finished');
                    const filesAfter = fs.readdirSync('.').filter((file) => file.substring(file.length - 9) === '.AppImage');
                    for (const file of filesAfter)
                        if (filesBefore.includes(file)) {
                            let savedPath = path.join('./', file);
                            if (this.params.output) {
                                if (fs.existsSync(this.params.output))
                                    fs.removeSync(this.params.output);
                                fs.moveSync(savedPath, this.params.output);
                                if (fs.existsSync(savedPath))
                                    fs.removeSync(savedPath);
                                savedPath = this.params.output;
                            }
                            console.log(`Saved file: ${savedPath}`);
                            break;
                        }
                    resolve();
                });
            });
        });
    }
    downloadAppImageTool() {
        return new Promise(async (resolve) => {
            process.stdout.write('Downloading AppImageTool');
            let downloading = true;
            const logger = () => {
                if (downloading) {
                    process.stdout.write('.');
                    setTimeout(logger, 250);
                }
            };
            setTimeout(logger, 250);
            await AppImageTool_js_1.default.install();
            downloading = false;
            process.stdout.write('\r\n');
            resolve();
        });
    }
    downloadLinuxDeploy() {
        return new Promise(async (resolve) => {
            process.stdout.write('Downloading LinuxDeploy');
            let downloading = true;
            const logger = () => {
                if (downloading) {
                    process.stdout.write('.');
                    setTimeout(logger, 250);
                }
            };
            setTimeout(logger, 250);
            await LinuxDeploy_js_1.default.install();
            downloading = false;
            process.stdout.write('\r\n');
            resolve();
        });
    }
}
exports.Bundler = Bundler;
;
