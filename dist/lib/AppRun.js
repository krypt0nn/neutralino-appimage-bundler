"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppRun {
    static generate(binary) {
        return [
            '#!/bin/bash', '',
            'cd "$APPDIR"', '',
            `exec "$APPDIR/${binary}"`
        ].join('\n');
    }
}
exports.default = AppRun;
;
