import { html } from "../template";
import { Processor } from '../lib/processor';

test("Processor.commitNode", () => {
    const templateGenerator = (className: string, text: string, content: string) => {
        return html`
            <p class="${ className }">${ text }</p>
            ${ content }
        `;
    }

    const data: Array<string> = [ "testClass", "Hello world!", "...from tests."]
    const template = templateGenerator("testClass", "Hello world!", "...from tests.");

    const processor: Processor = new Processor(template, document.body);
    
    const paragraph: HTMLElement = document.createElement("p");
    processor['commitNode'](paragraph, 1);
    expect(paragraph.getAttribute("class")).toBe(data[0]);

    const textNode: Node = document.createTextNode("test");
    processor['commitNode'](textNode, 2);
    expect(textNode.nodeValue).toBe(data[1]);

    const contentNode: Node = document.createTextNode("test");
    processor['commitNode'](contentNode, 3);
    expect(contentNode.nodeValue).toBe(data[2]);
});