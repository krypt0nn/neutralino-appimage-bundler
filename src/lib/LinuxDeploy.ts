import * as path from 'path';

import InstallTool from './InstallTool.js';

export default class LinuxDeploy extends InstallTool
{
    public static readonly uri: string = 'https://github.com/linuxdeploy/linuxdeploy/releases/download/continuous/linuxdeploy-x86_64.AppImage';
    public static readonly file: string = path.join(__dirname, '../../linuxdeploy');
};
