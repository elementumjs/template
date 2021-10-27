import * as Globals from '../lib/globals';

test("Globals.markGenerator", () => {
    expect(Globals.markGenerator(1)).toBe('<!--1-->');
    expect(Globals.markGenerator('1')).toBe('<!--1-->');
    expect(Globals.markGenerator()).toBe('<!----->');
});

test("Globals.isEndMark", () => {
    const endMarkString = Globals.markGenerator();
    const endMarkNode = document.createComment('-');
    expect(Globals.isEndMark(endMarkString)).toBe(true);
    expect(Globals.isEndMark(endMarkNode)).toBe(true);
    expect(Globals.isEndMark(Globals.markGenerator(1))).toBe(false); 
});

test("Globals.escapePart", () => {
    const part = `<div id="example-2">
        <p class="p_2">**Hello** ++World++!</p>
    </div>`;

    const escaped = `<div id="example-2">
        <p class="p_2">\\*\\*Hello\\*\\* \\+\\+World\\+\\+!</p>
    </div>`;

    expect(Globals.escapePart(part)).toBe(escaped)
});

test("Globals.startAttrParser", () => {
    expect(Globals.startAttrParser('<div class="box1 ')).toEqual([ 'class', 'box1 ']);
    expect(Globals.startAttrParser('<div class="')).toEqual([ 'class', '' ]);
    expect(Globals.startAttrParser('<div class="box1" data-value="')).toEqual([ 'data-value', '']);
    expect(Globals.startAttrParser('<div class="box1"')).toBe(null);
});

test("Globals.endAttrParser", () => {
    expect(Globals.endAttrParser(' box1">')).toBe(' box1');
    expect(Globals.endAttrParser('" data-foo="bar">')).toBe('');
    expect(Globals.endAttrParser('')).toBe(null);
});