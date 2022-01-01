export default abstract class ToolInstaller {
    static readonly uri: string;
    static readonly file: string;
    static installed(): Promise<boolean>;
    static install(): Promise<void>;
}
