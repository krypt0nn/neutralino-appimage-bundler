declare type DesktopEntries = {
    name: string;
    icon: string;
    exec: string;
    type?: string;
    categories?: string[] | string;
};
export default class Desktop {
    static generate(entries: DesktopEntries): string;
}
export type { DesktopEntries };
