import { html } from "../template.js";

const temp = (className, counter) => {
    return html`<div class="${className}" data-counter="data-${counter}-number">Counted <b>${counter} times</b></div>`;
}

test("Template.constructor", () => {
    let testClass = "testClass";
    let testCounter = 0;
    let testTemplate = temp(testClass, testCounter);

    expect(testTemplate.strings).toStrictEqual([
        '<!--1--><div class="',
        '" data-counter="',
        '">Counted <b><!--2-->',
        ' times</b></div>'
    ]);

    expect(testTemplate.slots).toStrictEqual([
        { slotIndex: 1, attr: "class", value: testClass },
        { slotIndex: 1, attr: "data-counter", value: `data-${testCounter}-number` },
        { slotIndex: 2, value: testCounter },
    ]);

    testClass = "otherTestClass";
    testCounter++;
    testTemplate = temp(testClass, testCounter);

    expect(testTemplate.slots).toStrictEqual([
        { slotIndex: 1, attr: "class", value: testClass },
        { slotIndex: 1, attr: "data-counter", value: `data-${testCounter}-number` },
        { slotIndex: 2, value: testCounter },
    ]);
});

test("Template.html", () => {
    let testClass = "testClass";
    let testCounter = 0;
    expect(temp(testClass, testCounter).html).toBe(
        `<!--1--><div class="${testClass}" data-counter="data-${testCounter}-number">Counted <b><!--2-->${testCounter}<!-----> times</b></div>`
    );

    testClass = "otherTestClass";
    testCounter = 1;
    expect(temp(testClass, testCounter).html).toBe(
        `<!--1--><div class="${testClass}" data-counter="data-${testCounter}-number">Counted <b><!--2-->${testCounter}<!-----> times</b></div>`
    );
});