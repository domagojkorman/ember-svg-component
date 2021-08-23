'use strict';

const fs = require('fs')

module.exports = {
  name: require('./package').name,

  _options() {
    return this.app.options.svgComponent;
  },

  preBuild() {
    this._options().paths.forEach((path) => {
      const files = fs.readdirSync(path.input);
      files.forEach((file) => {
        const outputDir = `${path.output}/${file.split('.')[0]}`;
        const inputFile = `${path.input}/${file}`;
        const outputFile = `${outputDir}/template.hbs`;
        const fsOptions = {encoding: 'utf-8'};
        fs.mkdirSync(outputDir, {recursive: true});

        const prevContent = fs.existsSync(outputFile) ? fs.readFileSync(outputFile, fsOptions) : null;
        const content = fs.readFileSync(inputFile, fsOptions);

        if (prevContent !== content) {
          fs.writeFileSync(``, content, {encoding: 'utf-8'});
        }
      });
    });
  },
};
