declare type Params = {
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
        categories?: string[] | string;
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
     * If specified as true - then AppImage will contain binary file shared libraries
     */
    includeLibraries?: boolean;
    /**
     * Array of folders to include as dependencies
     *
     * e.g. ['webkit2gtk-4.0'] to include webkit2gtk binaries
     */
    libraries?: string[];
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
export declare class Bundler {
    readonly appDir: string;
    params: Params;
    constructor(params: Params);
    bundle(): Promise<void>;
    protected downloadAppImageTool(): Promise<void>;
    protected downloadLinuxDeploy(): Promise<void>;
}
export type { Params };
