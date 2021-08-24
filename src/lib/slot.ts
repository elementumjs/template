import { endMarkNeedle } from "./common";
import { Processor } from "./processor";
import type { Template } from "./template";

/**
 * Slot object abstracts a fillable slot of a template.
 */
class Slot {
    /** The attribute index */
    slotIndex: number;
    /** The attribute name */
    attr?: string;
    /** The value of the field */
    value: any;

    get isAttr(): boolean {
        return this.attr !== null && this.attr !== undefined;
    }

    constructor(index: number, value: any, attr?: string) {
        this.slotIndex = index;
        this.attr = attr;
        this.value = value;
    }

    public commit(startMark: Node): void {
        // If {@link Slot} is not an attribute it will need a node type
        // commit, else it calls to {@link Processor.commitAttr}.
        if (!this.isAttr) {
            // If the {@link Slot} has an array of values it calls to
            // {@lin Processor.renderNodes}, else calls to 
            // {@link Processor.renderNode}.
            const slotValue = this.value;
            if (Array.isArray(slotValue)) {
                // Gets the referenced slot and its values.
                // If a {@link Slot} has an array of values, it's 
                // possible that more than one {@link Node} could be
                // affected. Iterate over curent {@link Node} siblings
                // looking for {@link Node.ELEMENT_NODE}.
                const slotNodes: Array<Node> = [];
                let endMark: Node = startMark.nextSibling;
                while (
                    endMark.nodeType !== Node.COMMENT_NODE && 
                    endMark.nodeValue !== endMarkNeedle
                ) {
                    slotNodes.push(endMark);
                    endMark = endMark.nextSibling;
                }
                this.commitTemplates(slotNodes, startMark, endMark, slotValue);
            } else {
                const node: Node = startMark.nextSibling;
                if (slotValue.constructor.name === "Template") {
                    this.commitTemplate(node, startMark, slotValue);
                } else this.commitValue(node, startMark, slotValue);
            }
        } else this.commitAttr(startMark.nextSibling);
    }

    private commitAttr(node: HTMLElement | Node): void {
        const { attr } = this;
        const value = Array.isArray(this.value) ? 
            this.value.join(" ") : this.value;

        const current = (node as HTMLElement).getAttribute(attr);
        if (current !== value) (node as HTMLElement).setAttribute(attr, value);
    }

    private commitValue(node: Node, startMark: Node, value: any): void {
        if (node === undefined || node === null) {
            startMark.parentNode.insertBefore(
                document.createTextNode(value), 
                startMark.nextSibling
            );
        } else if (node.nodeValue !== value) node.nodeValue = value;
    }

    private commitTemplate(node: Node, startMark: Node, template: Template) {
        if (node === undefined) {
            startMark.parentNode.insertBefore(template.element, startMark.nextSibling);
        } else if (node.nodeType === Node.COMMENT_NODE) {
            node.parentNode.insertBefore(template.element, node);
        } else if (template.match(node)) {
            new Processor(template, node).render();
        } else node.parentNode.replaceChild(template.element, node);
    }

    private commitTemplates(nodes: Array<Node>, startMark: Node, endMark: Node, templates: Array<Template>): void {
        // Calculate the limit of the iteration that is the highest length 
        // between the nodes list and values list.
        const templatesLength: number = templates.length,
            nodesLength: number = nodes.length,
            limit: number = templatesLength > nodesLength ? 
                templatesLength : nodesLength;

        // Iterate over values and nodes. 
        for (let i: number = 0; i < limit; i++) {
            const [ node, template ] = [nodes[i], templates[i] ];
            
            // If the current {@link Node} has not value, remove the 
            // current {@link Node}.
            if (template !== undefined) {
                // Throws an error if any of slot values is not a Template instance. 
                if (template.constructor.name !== "Template") {
                    const error = 'to render a template into a list, every list '+ 
                        'items must be a Template instance.';
                    throw new Error(error);
                }

                this.commitTemplate(node || endMark, startMark, template);
            } else if (node !== undefined) node.parentNode.removeChild(node);
        }
    }
}

export { Slot };