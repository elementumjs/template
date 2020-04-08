import Template from "../lib/template.js";
import TValue from "../lib/tvalue.js";

test("Template.constructor", () => {
    try { new Template([]) } catch (e) { expect(e).toBeInstanceOf(TypeError) }
    try { new Template( {raw: [1] }) } catch (e) { expect(e).toBeInstanceOf(TypeError) }
    try { new Template( {raw: ["<div>", "</div>"]}, []) } catch (e) { expect(e).toBeInstanceOf(Error) }

    let parts = {raw: [ "<p>", "<b>", "</b>", "</p>" ]};
    let data = [ "Hello", "world", "!" ];

    let template = new Template(parts, data);
    expect(template._parts).toStrictEqual(parts.raw);
    expect(template._template).toBeInstanceOf(HTMLElement);
    expect(template._template.tagName).toBe("TEMPLATE");
    template._data.forEach(value => expect(value).toBeInstanceOf(TValue));
    expect(template._data.map(i => i.value)).toStrictEqual(data);
});

test("Template._encodeMark", () => {
    try { Template._encodeMark([0]) } catch (e) { expect(e).toBeInstanceOf(TypeError) }
    try { Template._encodeMark({}) } catch (e) { expect(e).toBeInstanceOf(TypeError) }
    try { Template._encodeMark("0") } catch (e) { expect(e).toBeInstanceOf(TypeError) }
    try { Template._encodeMark(false) } catch (e) { expect(e).toBeInstanceOf(TypeError) }
    expect(Template._encodeMark(0)).toBe("<!--slot(0)-->");
});

test("Template._markTemplate", () => {
    let template = Object.create(Template.prototype);
    template._template = document.createElement("template");
    template._parts = [ "<p test=\"", "\"><b>", "</b>", "</p>" ];
    template._data = [ new TValue(null, ""), new TValue(null, ""), new TValue(null, "") ];
    template._markTemplate();

    expect(template._template.innerHTML).toBe("<p test=\"<!--slot(0)-->\"><b><!--slot(1)--></b><!--slot(2)--></p>");
});

test("Template._extractTNodes", () => {
    let target = Object.create(Template.prototype);
    target._tnodes = [];
    target._template = document.createElement("template");
    target._template.innerHTML = `<div class="<!--slot(0)-->">
        <p>Counted <!--slot(1)--> times</p>
        <button type="button" name="<!--slot(2)-->">Increase counter</button>
    </div>`;

    expect(target._extractTNodes).toThrow();

    target._data = Array(3);
    expect(() => target._extractTNodes()).not.toThrow();
    expect(target._tnodes.length).toBe(3);
});

test("Template._extractTSlots", () => {
    let target = Object.create(Template.prototype);
    target._tnodes = [];
    target._tslots = { refs: [], raw: [] }
    target._data = [ new TValue("a.a"), new TValue("a.b"), new TValue(null, 1) ];
    target._template = document.createElement("template");
    target._template.innerHTML = `<div class="<!--slot(0)-->">
        <p>Counted <!--slot(1)--> times</p>
        <button type="button" name="<!--slot(2)-->">Increase counter</button>
    </div>`;

    target._extractTNodes();
    expect(() => target._extractTSlots()).not.toThrow();

    expect(target._tslots.refs.length).toBe(2);
    expect(target._tslots.refs[0]).toEqual(expect.objectContaining({ 
        index: 0, tvalue: new TValue("a.a") 
    }));
    expect(target._tslots.refs[1]).toEqual(expect.objectContaining({ 
        index: 1, tvalue: new TValue("a.b") 
    }));

    expect(target._tslots.raw.length).toBe(1);
    expect(target._tslots.raw[0]).toEqual(expect.objectContaining({ 
        index: 2, tvalue: new TValue(null, 1) 
    }));
});

test("Template._getSlotValue", () => {
    let target = Object.create(Template.prototype);
    expect(() => target._getSlotValue({tvalue: new TValue("subdata")})).toThrow();

    let data = { subdata: 100 }
    expect(target._getSlotValue({tvalue: new TValue("subdata")}, data)).toBe(data.subdata);
    expect(target._getSlotValue({tvalue: new TValue(null, data.subdata)})).toBe(data.subdata);
});

test("Template.render", () => {
    let data = { counter: 0, class: "test" }
    let parts = { raw: [ "<div class=\"", "\"><p>Counted ", " times</p></div>" ] }
    let values = [ new TValue("class"), new TValue("counter") ];

    let target = new Template(parts, values);
    let container = document.createElement("section");
    expect(() => target.render(container, null)).toThrow();
    expect(() => target.render(null, data)).toThrow();

    target.render(container, data);
    expect(container.innerHTML).toBe("<div class=\"test\"><p>Counted <!--slot(1)-->0 times</p></div>");
});

test("Template.update", () => {
    let data = { counter: 0, class: "test" }
    let parts = { raw: [ "<div class=\"", "\"><p>Counted ", " times</p></div>" ] }
    let values = [ new TValue("class"), new TValue("counter") ];

    let target = new Template(parts, values);
    let container = document.createElement("section");
    target.render(container, data);

    expect(() => target.update(null, "counter", data.counter)).toThrow();
    expect(() => target.update(container, null, data.counter)).toThrow();
    expect(() => target.update(container, "", data.counter)).toThrow();
    expect(() => target.update(container, "counter", undefined)).toThrow();
    expect(() => target.update(container, "counter", null)).not.toThrow();

    data.counter++;
    target.update(container, "counter", data.counter);
    expect(container.innerHTML).toBe("<div class=\"test\"><p>Counted <!--slot(1)-->1 times</p></div>");
});