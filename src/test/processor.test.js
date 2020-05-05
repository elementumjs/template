import { html } from "../template.js";
import Processor from '../lib/processor.js';

test("Processor.commitNode", () => {
    const templateGenerator = (className, text, content) => {
        return html`
            <p class="${ className }">${ text }</p>
            ${ content }
        `;
    }

    let data = [ "testClass", "Hello world!", "...from tests."]
    const template = templateGenerator(...data);

    const processor = new Processor(template, document.body);
    
    const paragraph = document.createElement("p");
    processor.commitNode(paragraph, 1);
    expect(paragraph.getAttribute("class")).toBe(data[0]);

    const textNode = document.createTextNode("test");
    processor.commitNode(textNode, 2);
    expect(textNode.nodeValue).toBe(data[1]);

    const contentNode = document.createTextNode("test");
    processor.commitNode(contentNode, 3);
    expect(contentNode.nodeValue).toBe(data[2]);
});

// test("Processor.render", () => {});