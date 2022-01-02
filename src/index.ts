import AppImageTool from './lib/AppImageTool.js';
import LinuxDeploy from './lib/LinuxDeploy.js';
import Desktop from './lib/Desktop.js';
import AppRun from './lib/AppRun.js';

import * as fs from 'fs-extra';
import * as path from 'path';
import { spawn } from 'child_process';

type Params = {
    /**
     * Application version
     */
    version: string;

    desktop: {
        /**
         * Desktop name entry value
         */
        name: string;

        /**
         * Path to the icon
         */
        icon: string;

        /**
         * Desktop type entry value
         */
        type?: string;

        /**
         * Desktop categories entry value
         */
        categories?: string[]|string;
    };

    binary: {
        /**
         * Project folder (and binaries) name
         */
        name: string;
        
        /**
         * Path to the folder with binaries made by neutralino
         */
        dist: string;
    };

    /**
     * Should AppImage include neutralino's dependencies or not
     * 
     * If specified as true - then AppImage will contain webkit2gtk
     */
    includeLibraries?: boolean;

    /**
     * Object of files or folders to copy
     * 
     * "Relative path inside AppDir": "Absolute path to file or folder"
     */
    copy?: Map<string, string>;

    /**
     * Output AppImage path
     */
    output?: string;
};

export class Bundler
{
    public readonly appDir: string = path.join(__dirname, '../AppDir');

    public params: Params;

    public constructor(params: Params)
    {
        this.params = params;
    }

    public bundle(): Promise<void>
    {
        return new Promise(async (resolve) => {
            if (!await AppImageTool.installed())
                await this.downloadAppImageTool();

            if (!await LinuxDeploy.installed())
                await this.downloadLinuxDeploy();

            if (fs.existsSync(this.appDir))
            {
                console.log('Cleaning AppDir...');

                fs.removeSync(this.appDir);
            }

            console.log('Copying project files to AppDir...');

            fs.mkdirSync(this.appDir);
            fs.copyFileSync(path.join(this.params.binary.dist, this.params.binary.name, `${this.params.binary.name}-linux_x64`), path.join(this.appDir, this.params.binary.name));
            fs.copyFileSync(path.join(this.params.binary.dist, this.params.binary.name, 'resources.neu'), path.join(this.appDir, 'resources.neu'));
            fs.copyFileSync(this.params.desktop.icon, path.join(this.appDir, path.basename(this.params.desktop.icon)));

            if (this.params.copy)
            {
                Object.keys(this.params.copy).forEach((relative) => {
                    const relativePath = path.join(this.appDir, relative);

                    if (fs.lstatSync(this.params.copy![relative]).isDirectory())
                        fs.mkdirpSync(relativePath);

                    else fs.createFileSync(relativePath);

                    fs.copySync(this.params.copy![relative], relativePath);
                });
            }

            console.log('Creating desktop file...');

            const imageName = /(.*)\.[^\.]*|([^\.]*)/.exec(path.basename(this.params.desktop.icon))![1];

            fs.writeFileSync(path.join(this.appDir, `${this.params.binary.name}.desktop`), Desktop.generate({
                name: this.params.desktop.name,
                icon: imageName,
                exec: `AppRun`,
                type: this.params.desktop.type,
                categories: this.params.desktop.categories
            }));

            console.log('Creating AppRun file...');

            fs.writeFileSync(path.join(this.appDir, 'AppRun'), AppRun.generate(`${this.params.binary.name}`));
            fs.chmodSync(path.join(this.appDir, 'AppRun'), 0o755);

            console.log('Executing LinuxDeploy...');

            let additionalOptions: string[] = [];

            if (this.params.includeLibraries)
                additionalOptions = ['-e', path.join(this.appDir, this.params.binary.name)];

            // /linuxdeploy --appdir AppDir -d AppDir/app.desktop -i '[...]/test/public/icons/64x64.png' [-e AppDir/app] -o appimage
            const linuxDeployProcess = spawn(LinuxDeploy.file, [
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
                const filesBefore = fs.readdirSync('.').filter((file) => file.substring(file.length - 9) === '.AppImage');

                console.log('Executing AppImageTool...\r\n');

                // ./appimagetool AppDir
                const appImageToolProcess = spawn(AppImageTool.file, [this.appDir]);
    
                appImageToolProcess.stdout.on('data', (data) => console.log(data.toString()));
                appImageToolProcess.stdout.on('data', (data) => console.log(data.toString()));

                appImageToolProcess.on('close', () => {
                    console.log('Project building finished');

                    const filesAfter = fs.readdirSync('.').filter((file) => file.substring(file.length - 9) === '.AppImage');

                    for (const file of filesAfter)
                        if (filesBefore.includes(file))
                        {
                            let savedPath = path.join('./', file);

                            if (this.params.output)
                            {
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

    protected downloadAppImageTool(): Promise<void>
    {
        return new Promise(async (resolve) => {
            process.stdout.write('Downloading AppImageTool');

            let downloading = true;

            const logger = () => {
                if (downloading)
                {
                    process.stdout.write('.');

                    setTimeout(logger, 250);
                }
            }

            setTimeout(logger, 250);

            await AppImageTool.install();

            downloading = false;
            process.stdout.write('\r\n');

            resolve();
        });
    }

    protected downloadLinuxDeploy(): Promise<void>
    {
        return new Promise(async (resolve) => {
            process.stdout.write('Downloading LinuxDeploy');

            let downloading = true;

            const logger = () => {
                if (downloading)
                {
                    process.stdout.write('.');

                    setTimeout(logger, 250);
                }
            }

            setTimeout(logger, 250);

            await LinuxDeploy.install();

            downloading = false;
            process.stdout.write('\r\n');

            resolve();
        });
    }
};

export type { Params };
