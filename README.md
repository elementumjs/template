<img src="https://raw.githubusercontent.com/elementumjs/template/main/assets/header.svg"/>

[![CDN](https://img.shields.io/badge/CDN-jsDelivr-blueviolet)][1]
[![package_version](https://img.shields.io/npm/v/@elementumjs/template)][2]
[![production](https://github.com/elementumjs/template/workflows/production/badge.svg)][3]
[![develop](https://github.com/elementumjs/template/workflows/develop/badge.svg)][4]
[![reference](https://img.shields.io/badge/docs-REFERENCE-blue)][5]
[![license](https://img.shields.io/github/license/elementumjs/template)][6]

`@elementum/template` is a lightweight and powerful HTML template engine for vanilla WebComponents.

- [📝 How to use it][7]
  - [Creating a basic template: `html` function][8]
  - [Nested templates][9]
  - [Rendering into a container][10]
- [🧪 Full example][11]
- [⚙️ Installation][12]
  - [Import from CDN as ES Module][13]
  - [Or install the package locally][14]
  - [Other import methods][15]

---

<img src="https://raw.githubusercontent.com/elementumjs/template/main/assets/how-to-use-it.svg"/>

### How to use it

#### Creating a basic template: `html` function

To define and init a new `Template`, you need to use the `html` template tag:

```javascript
    import { html, render } from '@elementumjs/template';

    const template = (list) => html`<div>
            <p>My list has ${ list.length } item(s).</p>
        </div>`;
```

#### Nested templates

It's also possible define nested templates to create more complex elements. It is useful for render lists or conditionals:

 * **Basic template**: Include it into the html representation as other value using the `html` tag.
    ```javascript
        const template = () => html`<p>Random number: ${ html`<b>${ Math.random() }</b>` }</p>`;
    ```
 * **Conditional rendering**: Return a template based on a condition:
    ```javascript
        const userProfile = (user) => html`...`;
        const loginButton = () => html`...`;

        const template = (userLogged) => html`<div>
                ${ user !== undefined ? userProfile(user) : loginButton() }
            </div>`;
    ```
 * **List of templates**
    ```javascript
        const listTemplate = (list) => html`<ul>
                ${ list.map(item => html`<li>${ item }</li>` ) }
            </ul>`;
    ```

Following the example...
```javascript
    import { html, render } from '@elementumjs/template';

    const listTemplate = (list) => html`<ul>
            ${ list.map(item => html`<li>${ item }</li>` ) }
        </ul>`;

    const template = (list) => html`<div>
            <p>My list has ${ list.length } item(s).</p>
            ${ listTemplate(list) }
        </div>`;
```

#### Rendering into a container

To render the template into a container `HTMLElement`, the data to fill the template is passed as an attribute to the template generator function. The result of that function will be parsed by `render` function to check if the template is already rendered and update it or is not rendered yet and inject it.

```javascript
    import { html, render } from '@elementumjs/template';

    // const listTemplate = ...;
    // const template = ...;

    const list = [ "item 1" ];
    render(template(list), document.body /* the container to render the template */);
```

<img src="https://raw.githubusercontent.com/elementumjs/template/main/assets/full-example.svg"/>

### Full example

<img src="https://raw.githubusercontent.com/elementumjs/template/main/assets/demo.gif" width="550"/>

```javascript
    // import { html, render } from "https://cdn.jsdelivr.net/gh/elementumjs/template/dist/template.esm.js";
    import { html, render } from '@elementumjs/template';

    // Create the templates
    const listTemplate = (list) => html`<ul>
            ${ list.map(item => html`<li>${ item }</li>` ) }
        </ul>`;

    const template = (list) => html`<div>
            <p>My list has ${ list.length } item(s).</p>
            ${ listTemplate(list) }
        </div>`;

    // Instance the list and render the template into the container.
    const list = [ "item 1" ];
    render(template(list), document.body);

    // Update the list and re-render the template every second
    let loop = setInterval(() => {
        list.push(`item ${list.length + 1}`)
        render(template(list), document.body);

        if (counter == 5) clearInterval(loop);
    }, 1000);
```

<img src="https://raw.githubusercontent.com/elementumjs/template/main/assets/installation.svg"/>

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

[8]: #creating-a-basic-template-html-function

[9]: #nested-templates

[10]: #rendering-into-a-container

[11]: #full-example

[12]: #installation

[13]: #import-from-cdn-as-es.module

[14]: #or-install-the-package-locally

[15]: #other-import-methods
