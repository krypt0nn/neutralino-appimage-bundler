<h1 align="center">🚀 Neutralino AppImage Bundler</h1>

Bundle your Neutralino project in AppImage

⚠️ Works only on Linux x64 systems

# Installation

With npm:

```sh
npm i --save-dev neutralino-appimage-bundler
```

With yarn:

```sh
yarn add -D neutralino-appimage-bundler
```

# Usage

You can, for example, create file named `build-appimage.js`, with this content:

```js
const path = require('path');

// Require bundler
const { Bundler } = require('neutralino-appimage-bundler');

// Create an object with some params
const bundler = new Bundler({
    // .desktop file properties
    desktop: {
        // Name field
        name: 'Aboba Project',

        // Path to the icon
        icon: path.join(__dirname, 'test/public/icons/64x64.png'),

        // Categories (defult is Utilities)
        categories: ['Game']
    },

    // Neutralino binary info
    binary: {
        // Name of the binary (cli.binaryName)
        name: 'aboba-amogus',

        // Dist folder path
        dist: path.join(__dirname, 'test/dist')
    },

    // Some files or folders to copy inside of the the AppImage
    copy: {
        'public': path.join(__dirname, 'test/dist/aboba-amogus/public')
    },

    // Path to the appimage to save
    output: path.join(__dirname, 'el-passant.AppImage'),

    // Application version
    version: '2.0.0'
});

// Bundle project
bundler.bundle();
```

And update your `package.json` scripts:

```json
{
    "scripts": {
        "bundle:appimage": "node build-appimage.js"
    }
}
```

So you'll be able to run

```sh
yarn bundle:appimage
```

or

```sh
npm run bundle:appimage
```

Which will bundle your Neutralino application to the AppImage

<br>

Author: [Nikita Podvirnyy](https://vk.com/technomindlp)
