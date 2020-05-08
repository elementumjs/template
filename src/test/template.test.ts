import { html } from "../template";
import { Template } from "../lib/template";

const temp = (className: string, counter: number) => {
    return html`<div class="${className}" data-counter="data-${counter}-number">Counted <b>${counter} times</b></div>`;
}

test("Template.constructor", () => {
    let testClass: string = "testClass";
    let testCounter: number = 0;
    let testTemplate: Template = temp(testClass, testCounter);

    expect(testTemplate.strings).toStrictEqual([
        '<!--1--><div class="',
        '" data-counter="',
        '">Counted <b><!--2-->',
        ' times</b></div>'
    ]);

    expect(testTemplate.slots).toStrictEqual([
        { slotIndex: 1, attr: "class", value: testClass },
        { slotIndex: 1, attr: "data-counter", value: `data-${testCounter}-number` },
        { slotIndex: 2, attr: null, value: testCounter },
    ]);

    testClass = "otherTestClass";
    testCounter++;
    testTemplate = temp(testClass, testCounter);

    expect(testTemplate.slots).toStrictEqual([
        { slotIndex: 1, attr: "class", value: testClass },
        { slotIndex: 1, attr: "data-counter", value: `data-${testCounter}-number` },
        { slotIndex: 2, attr: null, value: testCounter },
    ]);
});

test("Template.html", () => {
    let testClass: string = "testClass";
    let testCounter: number = 0;
    expect(temp(testClass, testCounter).html).toBe(
        `<!--1--><div class="${testClass}" data-counter="data-${testCounter}-number">Counted <b><!--2-->${testCounter}<!-----> times</b></div>`
    );

    testClass = "otherTestClass";
    testCounter = 1;
    expect(temp(testClass, testCounter).html).toBe(
        `<!--1--><div class="${testClass}" data-counter="data-${testCounter}-number">Counted <b><!--2-->${testCounter}<!-----> times</b></div>`
    );
});