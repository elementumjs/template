import { Slot } from '../lib/slot';
import { Template } from "../lib/template";

// html string tag is an function that works as Template class constructor 
// wrapper.
const html = (
    strings: TemplateStringsArray, 
    ...args: Array<any>
) => new Template([...strings.raw], args);

const createParent = () => {
    const parent = document.createElement('div');
    const startMark = document.createComment('1');
    const endMark = document.createComment('-');
    parent.appendChild(startMark);
    parent.appendChild(endMark);

    return parent;
}

test("Slot.isAttr", () => {
    let fail = new Slot(1, {});
    expect(fail.isAttr).toBe(false);
    
    fail = new Slot(1, {}, null);
    expect(fail.isAttr).toBe(false);

    let success = new Slot(1, {}, 'attrName');
    expect(success.isAttr).toBe(true);
});

test("Slot.commit", () => {
    // Test attr
    const parentAttr = createParent();
    const attrTarget = document.createElement("span");
    attrTarget.setAttribute('attr', '');
    parentAttr.removeChild(parentAttr.lastChild);
    parentAttr.appendChild(attrTarget);

    const attrInterpolation = new Slot(1, 'Test', 'attr');
    const attrHandler = jest.spyOn(attrInterpolation as any, 'commitAttr');
    attrInterpolation.commit(parentAttr.firstChild);
    expect(attrHandler).toHaveBeenCalled();
    
    // Test value interpolation
    const parentValue = createParent();
    const interpolationNode = document.createTextNode('');
    parentValue.insertBefore(interpolationNode, parentValue.lastChild);
    
    const valueInterpolation = new Slot(1, 'Test');
    const valueHandler = jest.spyOn(valueInterpolation as any, 'commitValue');
    valueInterpolation.commit(parentValue.firstChild);
    expect(valueHandler).toHaveBeenCalled();

    // Test template interpolation
    const parentTemplate = createParent();
    const childTemplate = html`<p>Test</p>`;
    const templateInterpolation = new Slot(1, childTemplate);
    const templateHandler = jest.spyOn(templateInterpolation as any, 'commitTemplate');
    templateInterpolation.commit(parentTemplate.firstChild);
    expect(templateHandler).toHaveBeenCalled();

    // Test multiple template interpolation
    const parentTemplates = createParent();
    const templates = [ 'item1', 'item2', 'item3'].map(item => html`<p>${ item }</p>`);
    const templatesInterpolation = new Slot(1, templates);
    const templatesHandler = jest.spyOn(templatesInterpolation as any, 'commitTemplates');
    templatesInterpolation.commit(parentTemplates.firstChild);
    expect(templatesHandler).toHaveBeenCalled();
});


test("Slot.commitAttr", () => {
    // Test attr
    const parentAttr = createParent();
    const attrTarget = document.createElement("span");
    attrTarget.setAttribute('attr', '');
    parentAttr.removeChild(parentAttr.lastChild);
    parentAttr.appendChild(attrTarget);

    const attrInterpolation = new Slot(1, 'Test', 'attr');
    const attrHandler = jest.spyOn(attrInterpolation as any, 'commitAttr');
    attrInterpolation.commit(parentAttr.firstChild);
    expect(attrHandler).toHaveBeenCalled();
    expect(attrTarget.getAttribute('attr')).toBe('Test');

    attrInterpolation.value = [ 0, 1.3, false ];
    attrInterpolation.commit(parentAttr.firstChild);
    expect(attrHandler).toHaveBeenCalled();
    expect(attrTarget.getAttribute('attr')).toBe('0 1.3 false');

    attrInterpolation.value = { name: 'text' };
    attrInterpolation.commit(parentAttr.firstChild);
    expect(attrHandler).toHaveBeenCalled();
    expect(attrTarget.getAttribute('attr')).toBe('[object Object]');
});

test("Slot.commitValue", () => {
    // Test value interpolation
    const parentValue = createParent();
    const interpolationNode = document.createTextNode('');
    parentValue.insertBefore(interpolationNode, parentValue.lastChild);
    
    const valueInterpolation = new Slot(1, 'Test');
    const valueHandler = jest.spyOn(valueInterpolation as any, 'commitValue');
    valueInterpolation.commit(parentValue.firstChild);
    expect(valueHandler).toHaveBeenCalled();
    expect(interpolationNode.nodeValue).toBe('Test');

    valueInterpolation.value = '';
    valueInterpolation.commit(parentValue.firstChild);
    expect(valueHandler).toHaveBeenCalled();
    expect(interpolationNode.nodeValue).toBe('');

    valueInterpolation.value = null;
    valueInterpolation.commit(parentValue.firstChild);
    expect(valueHandler).toHaveBeenCalled();
    expect(interpolationNode.nodeValue).toBe('null');

    valueInterpolation.value = false;
    valueInterpolation.commit(parentValue.firstChild);
    expect(valueHandler).toHaveBeenCalled();
    expect(interpolationNode.nodeValue).toBe('false');

    valueInterpolation.value = [ "hello", "test!" ];
    valueInterpolation.commit(parentValue.firstChild);
    expect(valueHandler).toHaveBeenCalled();
    expect(interpolationNode.nodeValue).toBe('hello test!');
});

test("Slot.commitTemplate", () => {
    // Test template interpolation
    const parentTemplate = createParent();
    const simpleTemplate = html`<p>Test</p>`;
    const templateInterpolation = new Slot(1, simpleTemplate);
    const templateHandler = jest.spyOn(templateInterpolation as any, 'commitTemplate');
    
    templateInterpolation.commit(parentTemplate.firstChild);
    expect(templateHandler).toHaveBeenCalled();
    let target = parentTemplate.firstElementChild;
    expect(target.outerHTML).toBe('<p>Test</p>');

    const complexTemplate = html`<p>${ false }</p>`;
    templateInterpolation.value = complexTemplate;

    templateInterpolation.commit(parentTemplate.firstChild);
    expect(templateHandler).toHaveBeenCalled();
    target = parentTemplate.firstElementChild;
    expect(target.outerHTML).toBe('<p><!--1-->false<!-----></p>');
});

test("Slot.commitTemplates", () => {
    // Test multiple template interpolation
    const parentTemplates = createParent();
    const templates = [ 'item1', 'item2' ].map(item => html`<p>${ item }</p>`);
    const templatesInterpolation = new Slot(1, templates);
    const templatesHandler = jest.spyOn(templatesInterpolation as any, 'commitTemplates');

    templatesInterpolation.commit(parentTemplates.firstChild);
    expect(templatesHandler).toHaveBeenCalled();
    expect(parentTemplates.innerHTML).toBe('<!--1--><p><!--1-->item1<!-----></p><p><!--1-->item2<!-----></p><!----->')
});