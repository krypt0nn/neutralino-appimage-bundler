"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppRun {
    static generate(binary) {
        return [
            '#!/bin/bash',
            '',
            'if [ -z "$APPDIR" ] ; then',
            '   path="$(dirname "$(readlink -f "${THIS}")")"',
            '   while [[ "$path" != "" && ! -e "$path/$1" ]]; do',
            '       path=${path%/*}',
            '   done',
            '   APPDIR="$path"',
            'fi',
            '',
            'export PATH="${APPDIR}:${APPDIR}/usr/sbin:${PATH}"',
            'export XDG_DATA_DIRS="./share/:/usr/share/gnome:/usr/local/share/:/usr/share/:${XDG_DATA_DIRS}"',
            'export LD_LIBRARY_PATH="${APPDIR}/usr/lib:${LD_LIBRARY_PATH}"',
            'export XDG_DATA_DIRS="${APPDIR}"/usr/share/:"${XDG_DATA_DIRS}":/usr/share/gnome/:/usr/local/share/:/usr/share/',
            'export GSETTINGS_SCHEMA_DIR="${APPDIR}/usr/share/glib-2.0/schemas:${GSETTINGS_SCHEMA_DIR}"',
            '',
            'cd "$APPDIR"',
            '',
            `exec "$APPDIR/${binary}"`
        ].join('\n');
    }
}
exports.default = AppRun;
;
