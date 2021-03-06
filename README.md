<img src="https://raw.githubusercontent.com/elementumjs/template/master/assets/header.svg"/>

[![CDN](https://img.shields.io/badge/CDN-jsDelivr-blueviolet)][1]
[![package_version](https://img.shields.io/npm/v/@elementumjs/template)][2]
[![production](https://github.com/elementumjs/template/workflows/production/badge.svg)][3]
[![develop](https://github.com/elementumjs/template/workflows/develop/badge.svg)][4]
[![reference](https://img.shields.io/badge/docs-REFERENCE-blue)][5]
[![license](https://img.shields.io/github/license/elementumjs/template)][6]

`@elementum/template` is a lightweight and powerful HTML template engine for vanilla WebComponents.

- [📝 How to use it][7]
  - [Creating a template: `html` function][8]
  - [Rendering into a container][9]
- [🧪 Full example][10]
- [⚙️ Installation][11]
  - [Import from CDN as ES Module][12]
  - [Or install the package locally][13]
  - [Other import methods][14]

---

<img src="https://raw.githubusercontent.com/elementumjs/template/master/assets/how-to-use-it.svg"/>

### How to use it

#### Creating a template: `html` function

To define and init a new `Template`, you need to use the `html` template tag:

```javascript
    // import { html, render } from "https://cdn.jsdelivr.net/gh/elementumjs/template/dist/template.esm.js";
    import { html, render } from '@elementumjs/template';

    const template = (counter) => html`<h1>Counted ${ counter } times</h1>`;
```

#### Rendering into a container

To render the template into a container `HTMLElement`, the data to fill the template is passed as an attribute to the template generator function. The result of that function will be parsed by `render` function to check if the template is already rendered and update it or is not rendered yet and inject it.

```javascript
    // import { html, render } from "https://cdn.jsdelivr.net/gh/elementumjs/template/dist/template.esm.js";
    import { html, render } from '@elementumjs/template';

    // const template = ...;

    let counter = 0;
    render(template(counter), document.body /* the container to render the template */);
```

<img src="https://raw.githubusercontent.com/elementumjs/template/master/assets/full-example.svg"/>

### Full example

<img src="https://raw.githubusercontent.com/elementumjs/template/master/assets/demo.gif" width="350"/>

```javascript
    // import { html, render } from "https://cdn.jsdelivr.net/gh/elementumjs/template/dist/template.esm.js";
    import { html, render } from '@elementumjs/template';

    // Create the template
    const template = (counter) => html`<h1>Counted ${ counter } times</h1>`;

    // Instance the value and render the template into the container.
    let counter = 0;
    render(template(counter), document.body);

    // Update the value and render the template
    let loop = setInterval(() => {
        counter++;
        render(template(counter), document.body);

        if (counter == 10) clearInterval(loop);
    }, 1000);
```

<img src="https://raw.githubusercontent.com/elementumjs/template/master/assets/installation.svg"/>

### Installation

#### Import from CDN as ES Module

Import from [jsDelivr CDN](https://www.jsdelivr.com/):

```javascript
    import { html, render } from "https://cdn.jsdelivr.net/gh/elementumjs/template/dist/template.esm.js";
```

#### Or install the package locally

##### Download the package

Install via `npm`:

```sh
    npm install @elementumjs/template
```

##### Import as ES Module

[ES Module](http://exploringjs.com/es6/ch_modules.html) builds are intended for use with modern bundlers like [webpack 2](https://webpack.js.org) or [rollup](http://rollupjs.org/). Use it with ES6 JavaScript `import`:
  
```javascript
    import { html, render } from '@elementumjs/template';
```

#### Other import methods

Checkout other import methods in [`dist/README.md`](./dist/README.md).

[0]: assets/header.png

[1]: https://cdn.jsdelivr.net/gh/elementumjs/template/dist/template.umd.js

[2]: https://www.npmjs.com/package/@elementumjs/template

[3]: https://github.com/elementumjs/template/actions?query=workflow%3Aproduction

[4]: https://github.com/elementumjs/template/actions?query=workflow%3Adevelop

[5]: docs/globals.md

[6]: LICENSE

[7]: #how-to-use-it

[8]: #creating-a-template-html-function

[9]: #rendering-into-a-container

[10]: #full-example

[11]: #installation

[12]: #import-from-cdn-as-es.module

[13]: #or-install-the-package-locally

[14]: #other-import-methods
