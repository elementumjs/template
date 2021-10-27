import { Slot } from "../lib/slot";
import { Template } from "../lib/template";

// html string tag is an function that works as Template class constructor 
// wrapper.
const html = (
    strings: TemplateStringsArray, 
    ...args: Array<any>
) => new Template([...strings.raw], args);

test("Template.constructor", () => {
    let template = html`<div id="${ 'id1' }">
        <p class="${ 'class1' }">${ 'Hello World!' }</p>
    </div>`;

    const slots = [
        new Slot(1, 'id1', 'id'),
        new Slot(2, 'class1', 'class'),
        new Slot(3, 'Hello World!')
    ]

    const strings = [
        '<!--1--><div id="',
        '">\n       <!--2--><p class="',
        '"><!--3-->',
        '</p>\n    </div>'
    ]
    
    expect(template.slots).toEqual(slots);
    expect(template.strings).toEqual(strings);

    template = html`<h1>Hello World!</h1>`;
    expect(template.slots).toEqual([]); 
    expect(template.strings).toEqual([ '<h1>Hello World!</h1>' ]); 

    template = html``;
    expect(template.slots).toEqual([]); 
    expect(template.strings).toEqual([ '' ]); 
});

test("Template.html", () => {
    let template = html`<div id="${ 'id1' }">
        <p class="${ 'class1' }">${ 'Hello World!' }</p>
    </div>`;
    let expected = `<!--1--><div id="id1">
       <!--2--><p class="class1"><!--3-->Hello World!<!-----></p>
    </div>`;

    expect(template.html).toBe(expected);

    template = html`<h1>Hello World!</h1>`;
    expected = '<h1>Hello World!</h1>';
    expect(template.html).toBe(expected);

    template = html``;
    expected = '';
    expect(template.html).toBe(expected);

});
test("Template.element", () => {
    let template = html`<div id="${ 'id1' }">
        <p class="${ 'class1' }">${ 'Hello World!' }</p>
    </div>`;

    let expected = document.createRange().createContextualFragment(template.html);
    expect(template.element).toEqual(expected);
});

test("Template.toString", () => {
    let template = html`<div id="${ 'id1' }">
        <p class="${ 'class1' }">${ 'Hello World!' }</p>
    </div>`;

    expect(template.html).toBe(template.toString());
});

test("Template.match", () => {});