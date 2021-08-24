import { Processor } from "./processor";
import { Template, endMarkNeedle } from "./template";

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
                const target: Node = startMark.nextSibling;
                if (slotValue instanceof Template) {
                    this.commitTemplate(target, startMark, slotValue);
                } else this.commitValue(target, startMark, slotValue);
            }
        } else this.commitAttr(startMark.nextSibling);
    }

    /**
     * 
     * @param node 
     * @param slot 
     */
    private commitAttr(node: HTMLElement | Node): void {
        const { attr } = this;
        const value = Array.isArray(this.value) ? 
            this.value.join(" ") : this.value;

        const current = (node as HTMLElement).getAttribute(attr);
        if (current !== value) (node as HTMLElement).setAttribute(attr, value);
    }

    private commitValue(node: Node, startMark: Node, value: any): void {
        // If the {@link Node.nextSibling} is `undefined`, 
        // {@link Node.insertBefore} will insert the element at the  end of the 
        // parent {@link Node.childNodes}.
        if (node === undefined || node === null) {
            startMark.parentNode.insertBefore(
                document.createTextNode(value), 
                startMark.nextSibling
            );
        } else if (node.nodeValue !== value) node.nodeValue = value;
    }

    private commitTemplate(node: Node, startMark: Node, template: Template) {
        // Compare the html defintion of the current node with the new one 
        // before update it.
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
            
            // If the current {@link Node} has not value, remove the {@link Node}.
            if (template !== undefined) {
                // Throws an error if any of slot values is not a Template instance. 
                if (!(template instanceof Template)) {
                    const error = 'to render a template into a list, every list '+ 
                        'items must be a Template instance.';
                    throw new Error(error);
                }

                // If a iteration step has not a target node it will be a new 
                // element. If a iteration step has not a slot value associated, the
                // target node must be removed. If a iteration step has both args, 
                // the target node and the slot value, the target node is updated.
                this.commitTemplate(node || endMark, startMark, template);
            } else if (node !== undefined) node.parentNode.removeChild(node);
        }
    }
}

export { Slot };