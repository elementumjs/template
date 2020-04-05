import Path from '../lib/path.js';
import TNode from '../lib/tnode.js';

test("TNode.constructor", () => {
    try { new TNode(false); } catch (e) { expect(e).toBeInstanceOf(TypeError); }
    try { new TNode(12); } catch (e) { expect(e).toBeInstanceOf(TypeError); }
    try { new TNode([]); } catch (e) { expect(e).toBeInstanceOf(TypeError); }
    try { new TNode({}); } catch (e) { expect(e).toBeInstanceOf(TypeError); }

    expect(new TNode(document.createComment(""))).toBeInstanceOf(TNode);
});

test("TNode._getType", () => {
    let target = Object.create(TNode.prototype);
    target._node = document.createElement("div");
    target._node.setAttribute("test", "<!--slot(0)-->");
    target._outer = target._node.outerHTML;
    expect(target._getType()).toBe("attr");

    target._node = document.createComment("slot(1)");
    expect(target._getType()).toBe("interpolation");

    target._node = document.createTextNode("empty");
    target._outer = target._node.outerHTML;
    expect(target._getType()).toBe("empty");

    target._node = document.createElement("div");
    target._outer = target._node.outerHTML;
    expect(target._getType()).toBe("empty");

    target._node = document.createComment("");
    expect(target._getType()).toBe("empty");
});

test("TNode._parseAttr", () => {
    let target = Object.create(TNode.prototype);
    target.fields = new Map();
    target._node = document.createElement("div");
    target._type = target._getType();
    try { target._parseAttr() } catch (e) { expect(e).toBeInstanceOf(TypeError) }

    target._node.setAttribute("test0", "<!--slot(0)-->");
    target._outer = target._node.outerHTML;
    target._type = target._getType();
    target._parseAttr();

    expect(target.fields.size).toBe(1);
    expect(target.fields.get(0)).toEqual(expect.objectContaining({ "attr": "test0" }));

    target._node.setAttribute("test1", "<!--slot(1)-->");
    target._outer = target._node.outerHTML;
    target._parseAttr();

    expect(target.fields.size).toBe(2);
    expect(target.fields.get(0)).toEqual(expect.objectContaining({ "attr": "test0" }));
    expect(target.fields.get(1)).toEqual(expect.objectContaining({ "attr": "test1" }));
});

test("TNode._parseInter", () => {
    let target = Object.create(TNode.prototype);
    target._node = document.createComment("");
    target._type = target._getType();
    target.fields = new Map();
    try { target._parseInter() } catch(e) { expect(e).toBeInstanceOf(TypeError) }
    
    target._node = document.createComment("slot(0)");
    target._type = target._getType();
    target._parseInter();
    
    expect(target.fields.size).toBe(1);
    expect(target.fields.get(0)).toEqual(expect.objectContaining({ "nextElem": null }));
});

test("TNode._renderAttr", () => {
    let target = Object.create(TNode.prototype);
    target._node = document.createElement("div");
    target._type = target._getType();
    target.fields = new Map();
    try { target._renderAttr(elem); } catch (e) { expect(e).toBeInstanceOf(TypeError); }

    target._node.setAttribute("test1", "<!--slot(0)-->");
    target._node.setAttribute("test2", "<!--slot(1)-->");
    target._outer = target._node.outerHTML;
    target._type = target._getType();
    target._parseAttr();
    
    let field0 = target.fields.get(0);
    field0.value = "Hello world";
    target.fields.set(0, field0);

    let field1 = target.fields.get(1);
    field1.value = 10;
    target.fields.set(1, field1);

    let elem = document.createElement("div");
    elem.setAttribute("test3", 10);
    target._renderAttr(elem);
    
    expect(elem.getAttribute("test1")).toBe("Hello world");
    expect(elem.getAttribute("test2")).toBe("10");
    expect(elem.getAttribute("test3")).toBe("10");
});

test("TNode._renderInter", () => {
    let target = Object.create(TNode.prototype);
    target._node = document.createElement("div");
    target._type = target._getType();
    target.fields = new Map();
    try { target._renderInter(container); } catch (e) { expect(e).toBeInstanceOf(TypeError); }
    
    let container = document.createElement("div");
    target._node = document.createComment("slot(0)");
    container.appendChild(target._node);

    target._type = target._getType();
    target._parseInter();

    let temp = target.fields.get(0);
    temp.value = "Hello world";

    target.fields.set(0, temp);
    target._renderInter(container.childNodes[0]);

    expect(container.innerHTML).toBe("<!--slot(0)-->" + temp.value);

    container = document.createElement("div");
    container.appendChild(document.createElement("span"));
    container.appendChild(document.createComment("slot(0)"));
    container.appendChild(document.createTextNode("!"));
    
    target._node = container.childNodes[1];
    target._type = target._getType();
    target._parseInter();

    temp = target.fields.get(0);
    temp.value = "Hello world";
    target.fields.set(0, temp);
    target._renderInter(container.childNodes[1]);

    expect(container.innerHTML).toBe("<span></span><!--slot(0)-->" + temp.value + "!");
});

test("TNode._clearInter", () => {
    let target = Object.create(TNode.prototype);
    target._node = document.createComment("slot(0)");
    try { target._clearInter(null, null) } catch (e) { expect(e).toBeInstanceOf(TypeError) }

    let container = document.createElement("div");
    container.appendChild(target._node);
    container.appendChild(document.createElement("span"));
    container.appendChild(document.createTextNode("end"));
    container.appendChild(document.createElement("p"));
    
    target._clearInter(container.childNodes[0], container.childNodes[2]);
    expect(container.innerHTML).toBe("<!--slot(0)-->end<p></p>");

    container = document.createElement("div");
    container.appendChild(target._node);
    container.appendChild(document.createElement("span"));
    container.appendChild(document.createElement("p"));
    container.appendChild(document.createTextNode("end"));

    target._clearInter(container.childNodes[0], null);
    expect(container.innerHTML).toBe("<!--slot(0)-->");

    container = document.createElement("div");
    container.appendChild(document.createTextNode("end"));
    container.appendChild(target._node);
    container.appendChild(document.createElement("span"));
    container.appendChild(document.createElement("p"));

    target._clearInter(container.childNodes[1], null);
    expect(container.innerHTML).toBe("end<!--slot(0)-->");
});

test("TNode.setFieldValue", () => {
    let target = Object.create(TNode.prototype);
    target._node = document.createComment("slot(0)");
    target._type = target._getType();
    target.fields = new Map();
    target._parseInter();

    let container = document.createElement("div");
    container.appendChild(target._node);
    
    target.setFieldValue(0, "Hello world");
    expect(target.fields.get(0).value).toBe("Hello world");

    target.setFieldValue(0, 10);
    expect(target.fields.get(0).value).toBe(10);

    target.setFieldValue(0, false);
    expect(target.fields.get(0).value).toBe(false);
});

test("TNode.render", () => {   
    let container = document.createElement("div");
    
    let attrTarget = Object.create(TNode.prototype);
    attrTarget._node = document.createElement("div");
    attrTarget._node.setAttribute("test", "<!--slot(0)-->");
    attrTarget._outer = attrTarget._node.outerHTML;
    attrTarget._type = attrTarget._getType();
    attrTarget.fields = new Map();
    
    let interTarget = Object.create(TNode.prototype);
    interTarget._node = document.createComment("slot(0)");
    interTarget._type = interTarget._getType();
    interTarget.fields = new Map();
    
    container.appendChild(attrTarget._node);
    container.appendChild(document.createTextNode("foo"));
    container.appendChild(interTarget._node);
    container.appendChild(document.createElement("span"));
    
    attrTarget._parseAttr();
    interTarget._parseInter();

    attrTarget.path = Path.fromNode(attrTarget._node);
    attrTarget.setFieldValue(0, "test1");
    attrTarget.render(container);

    interTarget.path = Path.fromNode(interTarget._node);
    interTarget.setFieldValue(0, "test2");
    interTarget.render(container);

    expect(container.innerHTML).toBe("<div test=\"test1\"></div>foo<!--slot(0)-->test2<span></span>");
});