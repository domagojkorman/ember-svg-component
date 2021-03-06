'use strict'

const fs = require('fs')
const funnel = require('broccoli-funnel')
const merge = require('broccoli-merge-trees');

module.exports = {
  name: require('./package').name,

  _options() {
    return this.app.options.svgComponent
  },

  _generateSvgComponents() {
    this._options().paths.forEach((path) => {
      const files = fs.readdirSync(path.input)
      files.forEach((file) => {
        const outputDir = `./tmp/svg-component/components/svg-component/korman-${file.split('.')[0]}`
        const inputFile = `${path.input}/${file}`
        const outputFile = `${outputDir}/template.hbs`
        const fsOptions = {encoding: 'utf-8'}
        fs.mkdirSync(outputDir, {recursive: true})

        const prevContent = fs.existsSync(outputFile) ? fs.readFileSync(outputFile, fsOptions) : null
        const content = fs.readFileSync(inputFile, fsOptions)

        if (prevContent !== content) {
          fs.writeFileSync(outputFile, content, {encoding: 'utf-8'})
        }
      })
    })
  },

  preprocessTree(type, tree) {
    if (type !== 'js') {
      return tree
    }
    this._generateSvgComponents()
    const htmlbarsAddon = this.addons.find(addon => addon.name === 'ember-cli-htmlbars')
    const svgFunnel = funnel('./tmp/svg-component', {
      srcDir: '.',
      destDir: `${this.app.name}/`
    })

    const hbsTree = htmlbarsAddon.transpileTree(svgFunnel, {
      ...htmlbarsAddon.htmlbarsOptions()
    })
    return merge([tree, hbsTree])
  }
}
