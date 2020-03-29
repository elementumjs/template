![template header][0]

# `template`

[![production](https://github.com/elementumjs/template/workflows/production/badge.svg)][1]
[![develop](https://github.com/elementumjs/template/workflows/develop/badge.svg)][2]
[![package_version](https://img.shields.io/github/package-json/v/elementumjs/template)][3]
[![reference](https://img.shields.io/badge/docs-REFERENCE-blue)][4]
[![license](https://img.shields.io/github/license/elementumjs/template)][5]


Simple HTML template engine for vanilla WebComponents. 

- [`template`][6]
  - [Add Github Packages to your registry][7]
  - [Installation][8]
  - [Import][9]
    - [HTML `<script>` tag][10]
    - [JavaScript `import`][11]
    - [Node `require`][12]
  - [Using a template][13]
    - [Template declaration: `html` & `val`][14]
    - [Render and update][15]
    - [Example][16]

---

***Updates only the necessary:***

![template demo][17]

### Add Github Packages to your registry

Create or edit the `.npmrc` file in the same directory as your `package.json` and include the following line:

```
    registry=https://npm.pkg.github.com/elementumjs
```

### Installation

Install via `npm`:
```sh
    npm install @elementumjs/template
```

### Import

#### HTML `<script>` tag

```html
    <script src="/node_modules/elementumjs/template/dist/template.umd.js"></script>
```

#### JavaScript `import`
  
```javascript
    import Data from '@elementumjs/template';
```

#### Node `require`

```javascript
    var Data = require('elementumjs/template');
```

### Using a template

#### Template declaration: `html` & `val`

#### Render and update

#### Example

```javascript

import { html, val } from '../dist/template.esm.js';

// Init data to fill the template
let data = {
    counter: 0,
    text: "Watch which elements are updated on dev-tools"
}

// Instance the container element and creates the template
let container = document.getElementById('static-container');
let template = html`
    <div>
        <h1>Counter ${ val`counter` }</h1>
        <p>${ data.text }</p>
    </div>
`;

// Render and update on data change
template.render(container, data);

// Update value and template loop
let loop = setInterval(() => {
    data.counter++;
    template.update(container, 'counter', data.counter);

    if (data.counter == 10) clearInterval(loop);
}, 1000);
```


[0]: assets/header.png

[1]: https://github.com/elementumjs/template/actions?query=workflow%3Aproduction

[2]: https://github.com/elementumjs/template/actions?query=workflow%3Adevelop

[3]: https://github.com/elementumjs/template/packages/

[4]: REFERENCE.md

[5]: LICENSE

[6]: #template

[7]: #add-github-packages-to-your-registry

[8]: #installation

[9]: #import

[10]: #html-script-tag 

[11]: #javascript-import 

[12]: #node-require 

[13]: #using-a-template

[14]: #template-declaration-html-&-val

[15]: #render-and-update

[16]: #example

[17]: assets/demo.gif