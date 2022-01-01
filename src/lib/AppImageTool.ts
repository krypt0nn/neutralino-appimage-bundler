import * as path from 'path';

import InstallTool from './InstallTool.js';

export default class AppImageTool extends InstallTool
{
    public static readonly uri: string = 'https://github.com/AppImage/AppImageKit/releases/download/continuous/appimagetool-x86_64.AppImage';
    public static readonly file: string = path.join(__dirname, '../../appimagetool');
};
