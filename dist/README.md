## Explanation of Build Files

| | UMD | CommonJS | ES Module |
|---:|:---:|:---:|:---:|
| **File** | template.umd.js | template.cjs.js | template.esm.js |

### Terms

- **[UMD](https://github.com/umdjs/umd)**: UMD builds can be used directly in the browser via a `<script>` tag. The default file from jsDelivr CDN at [https://www.jsdelivr.com/gh/elementumjs/template](https://cdn.jsdelivr.net/gh/elementumjs/template/dist/template.umd.js) is the UMD build (`template.umd.js`).

- **[CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1)**: CommonJS builds are intended for use with older bundlers like [browserify](http://browserify.org/) or [webpack 1](https://webpack.github.io). The default file for these bundlers (`pkg.main`) is the CommonJS build (`template.cjs.js`).

- **[ES Module](http://exploringjs.com/es6/ch_modules.html)**: ES module builds are intended for use with modern bundlers like [webpack 2](https://webpack.js.org) or [rollup](http://rollupjs.org/). The default file for these bundlers (`pkg.module`) is the ES Module build (`template.esm.js`).
