
'use strict'

const path = require('path')
const glob = require('glob')
const SpriteSmith = require('spritesmith')

/**
 * @class WebpackSpriteLoader
 * Webpack plugin to generate a sprite file from a glob pattern
 * No css is exported, but requiring the file will return its coordinates
 */
class WebpackSpriteLoader {

  constructor (options) {
    this.options = options
    this.loaderPath = path.join(__dirname, 'sprite-loader.js')
    this.files = glob.sync(options.glob, {cwd: options.cwd})
      .map(file => path.resolve(options.cwd, file))
    this.coords = {}
    this.file = ''
  }

  compile (compilation, cb) {
    SpriteSmith.run({src: this.files}, (err, output) => {
      if (err) { return cb(err) }
      this.coords = output.coordinates
      this.buffer = output.image
      cb()
    })
  }

  /**
   * Webpack apply hook, this is the plugin entrypoint
   */
  apply (compiler) {

    /**
     * In the run hook,
     * Run spritesmith with the provided files.
     */
    compiler.plugin('watch-run', this.compile.bind(this))
    compiler.plugin('run', this.compile.bind(this))

    /**
     * In the emit hook,
     * Output the buffer returned by spritesmith.
     */
    compiler.plugin('emit', (compilation, callback) => {
      compilation.assets[this.options.result] = {
        source: () => this.buffer,
        size: () => this.buffer.length
      }
      callback()
    })

    /**
     * In the nmf after-resolve,
     * If we encounter a require to a file in the defined sprite files
     * Update to use our custom loader passing along context
     */
    compiler.plugin('normal-module-factory', nmf => {
      nmf.plugin('after-resolve', (data, cb) => {
        if (!data) { return cb() }

        const resolved = path.resolve(data.context, data.request)
        if (this.files.indexOf(resolved) > -1) {
          const coords = JSON.stringify(this.coords[resolved])
          data.loaders = [`${this.loaderPath}?${coords}`]
        }

        cb(null, data)
      })
    })

    /**
     * Add the generated file to the html webpack plugin so it can be rendered
     */
    compiler.plugin('compilation', compilation => {
      compilation.plugin('html-webpack-plugin-before-html-generation', (data, callback) => {
        data.assets.sprite = this.options.result
        callback()
      })
    })

  }

}

module.exports = WebpackSpriteLoader
