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
    try { target._renderAttr(elem); } catch (e) { expect(e).toBeInstanceOf(TypeError); }

    elem.setAttribute("test1", "<!--slot(0)-->");
    elem.setAttribute("test2", "<!--slot(1)-->");
    elem.setAttribute("test3", 10);
    target = new TNode(elem);
    
    let field0 = target.fields.get(0);
    field0.value = "Hello world";
    let field1 = target.fields.get(1);
    field1.value = 10;

    target.fields.set(0, field0);
    target.fields.set(1, field1);
    target._renderAttr(elem);

    expect(elem.getAttribute("test1")).toBe("Hello world");
    expect(elem.getAttribute("test2")).toBe("10");
    expect(elem.getAttribute("test3")).toBe("10");
});

test("TNode._renderInter", () => {
    let container = document.createElement("div");
    let target = new TNode(container);
    try { target._renderInter(container); } catch (e) { expect(e).toBeInstanceOf(TypeError); }
    
    container.appendChild(document.createComment("slot(0)"));
    target = new TNode(container.childNodes[0]);

    let temp = target.fields.get(0);
    temp.value = "Hello world";

    target.fields.set(0, temp);
    target._renderInter(container.childNodes[0]);

    expect(container.innerHTML).toBe("<!--slot(0)-->" + temp.value);

    container = document.createElement("div");
    container.appendChild(document.createElement("span"));
    container.appendChild(document.createComment("slot(0)"));
    container.appendChild(document.createTextNode("!"));
    target = new TNode(container.childNodes[1]);

    temp = target.fields.get(0);
    temp.value = "Hello world";
    target.fields.set(0, temp);
    target._renderInter(container.childNodes[1]);

    expect(container.innerHTML).toBe("<span></span><!--slot(0)-->" + temp.value + "!");
});

test("TNode._clearInter", () => {
    try { 
        new TNode(document.createElement("div"))._clearInter(null, null) 
    } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
    }

    let container = document.createElement("div");
    container.appendChild(document.createComment("slot(0)"));
    container.appendChild(document.createElement("span"));
    container.appendChild(document.createTextNode("end"));
    container.appendChild(document.createElement("p"));

    let target = new TNode(container.childNodes[0]);
    target._clearInter(container.childNodes[0], container.childNodes[2]);

    expect(container.innerHTML).toBe("<!--slot(0)-->end<p></p>");

    container = document.createElement("div");
    container.appendChild(document.createComment("slot(0)"));
    container.appendChild(document.createElement("span"));
    container.appendChild(document.createElement("p"));
    container.appendChild(document.createTextNode("end"));

    target = new TNode(container.childNodes[0]);
    target._clearInter(container.childNodes[0], null);

    expect(container.innerHTML).toBe("<!--slot(0)-->");

    container = document.createElement("div");
    container.appendChild(document.createTextNode("end"));
    container.appendChild(document.createComment("slot(0)"));
    container.appendChild(document.createElement("span"));
    container.appendChild(document.createElement("p"));

    target = new TNode(container.childNodes[1]);
    target._clearInter(container.childNodes[1], null);

    expect(container.innerHTML).toBe("end<!--slot(0)-->");
});

test("TNode.setFieldValue", () => {
    let container = document.createElement("div");
    container.appendChild(document.createComment("slot(0)"));
    
    let target = new TNode(container.childNodes[0]);
    
    target.setFieldValue(0, "Hello world");
    expect(target.fields.get(0).value).toBe("Hello world");

    target.setFieldValue(0, 10);
    expect(target.fields.get(0).value).toBe(10);

    target.setFieldValue(0, false);
    expect(target.fields.get(0).value).toBe(false);
});

test("TNode.render", () => {   
    let container = document.createElement("div");
    
    let attrElem = document.createElement("div");
    attrElem.setAttribute("test", "<!--slot(0)-->");
    container.appendChild(attrElem);

    container.appendChild(document.createTextNode("foo"));

    let iterElem = document.createComment("slot(0)");
    container.appendChild(iterElem);

    container.appendChild(document.createElement("span"));

    let attrTarget = new TNode(attrElem);
    attrTarget.setFieldValue(0, "test1");
    attrTarget.render(container);

    let iterTarget = new TNode(iterElem);
    iterTarget.setFieldValue(0, "test2");
    iterTarget.render(container);

    expect(container.innerHTML).toBe("<div test=\"test1\"></div>foo<!--slot(0)-->test2<span></span>");
});