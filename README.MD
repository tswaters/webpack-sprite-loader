# webpack-sprite-plugin

Uses spritesmith to generate sprites map

When requiring sprite files in javascript, their coordinates in the sprite will be returned.

CSS is not emitted.  This is intended to be used with canvas `drawImage`.

## Installation

```
npm i --save-dev webpack-sprite-plugin
```

This has been tested to work with webpack 2.2.0
Webpack 1.x support is unknown.

## Usage

```js
const WebpackSpritePlugin = require('webpack-sprite-plugin')
module.exports = {
  output: {
    path: './dist'
  },
  plugins: [
    new WebpackSpritePlugin({
      cwd: path.resolve(__dirname, 'src/assets'),
      glob: '*.png',
      result: 'images/sprite.png'
    })
  ]
}
```

This will load all files under ./src/assets/*.png
and generate a sprite image under './dist/images/sprite.png'

This plugin integrates with `html-webpack-plugin`
It will add a `assets.sprite` to the html webpack generation

This can be used in a custom template like so:

```ejs
<img id="sprite" style="display:none" src="<%= htmlWebpackPlugin.files.sprite %>">
```

Inside your code file, you can require the individual assets and will be returned coordinates.
This works quite well with canvas#drawImage

```js
import someImage from './assets/some-image.png' // {"x":115,"y":30,"width":16,"height":16}
const image = document.getElementById('sprite')
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
ctx.drawImage(image, someImage.x, someImage.y, someImage.width, someImage.height, 0, 0, 16, 16)
```

## License

MIT
