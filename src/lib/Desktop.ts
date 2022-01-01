type DesktopEntries = {
    name: string;
    icon: string;
    exec: string;
    type?: string;
    categories?: string[]|string;
};

export default class Desktop
{
    public static generate(entries: DesktopEntries): string
    {
        if (!entries.categories)
            entries.categories = 'Utility';
        
        return [
            `[Desktop Entry]`,
            `Name=${entries.name}`,
            `Icon=${entries.icon}`,
            `Exec=${entries.exec}`,
            `Type=${entries.type ?? 'Application'}`,
            `Categories=${typeof entries.categories === 'string' ? entries.categories : entries.categories.join(';')};`,
            'Terminal=false'
        ].join('\n');
    }
};

export type { DesktopEntries };
