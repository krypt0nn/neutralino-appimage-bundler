export default class AppRun
{
    public static generate(binary: string): string
    {
        return [
            '#!/bin/bash', '',
            'cd "$APPDIR"', '',
            `exec "$APPDIR/${binary}"`
        ].join('\n');
    }
};
