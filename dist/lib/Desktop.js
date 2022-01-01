"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Desktop {
    static generate(entries) {
        var _a;
        if (!entries.categories)
            entries.categories = 'Utility';
        return [
            `[Desktop Entry]`,
            `Name=${entries.name}`,
            `Icon=${entries.icon}`,
            `Exec=${entries.exec}`,
            `Type=${(_a = entries.type) !== null && _a !== void 0 ? _a : 'Application'}`,
            `Categories=${typeof entries.categories === 'string' ? entries.categories : entries.categories.join(';')};`,
            'Terminal=false'
        ].join('\n');
    }
}
exports.default = Desktop;
;
