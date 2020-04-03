![template header][0]

# `template`

[![production](https://github.com/elementumjs/template/workflows/production/badge.svg)][1]
[![develop](https://github.com/elementumjs/template/workflows/develop/badge.svg)][2]
[![package_version](https://img.shields.io/github/package-json/v/elementumjs/template)][3]
[![reference](https://img.shields.io/badge/docs-REFERENCE-blue)][4]
[![license](https://img.shields.io/github/license/elementumjs/template)][5]

Simple HTML template engine for vanilla WebComponents.

⚠️ Under development library. Do not use it in production projects. ⚠️

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
    - [Full example][16]

---

### Add Github Packages to your registry

Create or edit the `.npmrc` file in the same directory as your `package.json` and include the following line:

        registry=https://npm.pkg.github.com/elementumjs

### Installation

Install via `npm`:

        npm install @elementumjs/template

### Import

#### HTML `<script>` tag

```html
    <script src="/node_modules/elementumjs/template/dist/template.umd.js"></script>
    <script>
        // Template.html...
    </script>
```

#### JavaScript `import`
  
```javascript
    import { html, val } from '@elementumjs/template';
```

#### Node `require`

```javascript
    var Template = require('elementumjs/template');
    // Template.html...
```

### Using a template

#### Template declaration: `html` & `val`

##### Initialize the template with the `html` tag

To define and init a new `Template`, you need to use the `html` template tag:

```javascript
    import { html } from '@elementumjs/template';

    let template = html`<div>
        <h1>Hello World!</h1>
        <p>This is a plain template</p>
    </div>`
```

##### Refering data with `val` tag

To create a reactive template based on an object the data values you need to use the `val` template tag into the definition of the string template during the `Template` initialization.

To reference any value, you can apply the `val` tag to a data path reference. For example, if you want to reference the `counter` in the following snippet you need to pass the path of that variable into its container object: `myProducts.counter`.

```javascript
    import { html, val } from '@elementumjs/template';

    let data = {
        myProducts: {
            counter: 0
        }
    }

    let template = html`
        <span>
            I got ${ val`myProducts.counter` } product(s)
        </span>`;
```

#### Render and update

#### Render the template into a `container`

To render de initialized `Template` you need to use its `render` function. This function receives two arguments:

- `container`: The parent `HTML Node` to render the template.
- `data`: The source object to get the values and inflate the `Template`.

```javascript
    // import ...

    // let data = {...}
    // let template = html`...`

    let container = document.getElementById('container');
    template.render(container, data);
```

#### Update when data changes

To update a rendered `Template` you need to use its `update` function. This function receives three arguments:

- `container`: The parent `HTML Node` to update the template.
- `path`: The path of referenced value to update.
- `value`: The updated value.

```javascript
    // import ...

    // let data = {...}
    // let template = html`...`

    // let container = ...
    // template.render(container, data);

    data.myProducts.counter += 2;
    template.update(container, "myProducts.counter", data.myProducts.counter);
```

#### Full example

![template demo][17]

```javascript
    import { html, val } from '../dist/template.esm.js';

    // Init data to fill the template
    let data = {
        counter: 0,
        text: "Watch which elements are updated on dev-tools"
    }

    // Instance the container element and creates the template
    let container = document.getElementById('container');
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

[16]: #full-example

[17]: assets/demo.gif