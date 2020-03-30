import TNode from '../lib/tnode.js';

test("TNode.constructor", () => {
    try { new TNode(false); } catch (e) { expect(e).toBeInstanceOf(TypeError); }
    try { new TNode(12); } catch (e) { expect(e).toBeInstanceOf(TypeError); }
    try { new TNode([]); } catch (e) { expect(e).toBeInstanceOf(TypeError); }
    try { new TNode({}); } catch (e) { expect(e).toBeInstanceOf(TypeError); }

    expect(new TNode(document.createComment(""))).toBeInstanceOf(TNode);
});

test("TNode._getType", () => {
    let attr = document.createElement("div");
    attr.setAttribute("test", "<!--slot(0)-->");
    expect(new TNode(attr)._getType()).toBe("attr");

    let interpolation = document.createComment("slot(1)");
    expect(new TNode(interpolation)._getType()).toBe("interpolation");

    let empty = document.createTextNode("empty");
    expect(new TNode(empty)._getType()).toBe("empty");
    empty = document.createElement("div");
    expect(new TNode(empty)._getType()).toBe("empty");
    empty = document.createComment("");
    expect(new TNode(empty)._getType()).toBe("empty");
});

test("TNode._parseAttr", () => {
    let elem = document.createElement("div");
    let target = new TNode(elem);
    target._parseAttr();

    expect(target.fields.size).toBe(0);
    
    elem.setAttribute("test0", "<!--slot(0)-->");
    target = new TNode(elem);
    target._parseAttr();

    expect(target.fields.size).toBe(1);
    expect(target.fields.get(0)).toEqual(expect.objectContaining({ "attr": "test0" }));

    elem.setAttribute("test1", "<!--slot(1)-->");
    target = new TNode(elem);
    target._parseAttr();

    expect(target.fields.size).toBe(2);
    expect(target.fields.get(0)).toEqual(expect.objectContaining({ "attr": "test0" }));
    expect(target.fields.get(1)).toEqual(expect.objectContaining({ "attr": "test1" }));
});

test("TNode._parseInter", () => {
    let elem = document.createComment("");
    let target = new TNode(elem);
    target._parseInter();
    
    expect(target.fields.size).toBe(0);
    
    elem = document.createElement("div");
    elem.innerHTML = `<!--slot(0)--><span></span>`;
    
    target = new TNode(elem.childNodes[0]);
    target._parseInter();
    
    expect(target.fields.size).toBe(1);
    expect(target.fields.get(0)).toEqual(expect.objectContaining({ "nextElem": "div/span" }));
});

test("TNode._renderAttr", () => {
    let elem = document.createElement("div");
    let target = new TNode(elem);
    
});

test("TNode._renderInter", () => {

});

test("TNode._clearInter", () => {

});

test("TNode.setFieldValue", () => {

});

test("TNode.render", () => {

});