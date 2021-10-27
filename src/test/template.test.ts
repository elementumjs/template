import { html } from "../template";
import { Slot } from "../lib/slot";

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
    
    let empty = () => html``;
    let noSlot = () => html`<h1>Hello World!</h1>`;
    expect(empty).toThrow();
    expect(noSlot).toThrow();
});

test("Template.html", () => {
    let template = html`<div id="${ 'id1' }">
        <p class="${ 'class1' }">${ 'Hello World!' }</p>
    </div>`;
    let expected = `<!--1--><div id="id1">
       <!--2--><p class="class1"><!--3-->Hello World!<!-----></p>
    </div>`;

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