import { isEndMark } from "./globals";
import { NotTemplateErr } from "./error";

import { Processor } from "./processor";
import type { Template } from "./template";

/**
 * Slot class abstracts a fillable slot of a template. It will affect to a 
 * HTMLElement as an argument, value or another or anothers 
 * {@link Template}'s.
 * @class Slot
 */
class Slot {
    /** The {@link Slot} index into a {@link Template}. */
    slotIndex: number;
    /**
     * If the current {@link Slot} is an attribute of a HTMLElement it 
     * defines the attribute name.
     */
    attr?: string;
    /** The current {@link Slot} value. */
    value: any;

    /**
     * isAttr property getter returns a boolean that is `true` if the current
     * {@link Slot} has been parsed as a HTML attribute.
     * @returns {boolean} - The result of the assertion.
     */
    get isAttr(): boolean {
        return this.attr !== null && this.attr !== undefined;
    }

    /**
     * containsTemplate property getter returns a boolean that is `true` if the current
     * {@link Slot} value is an instance of a Template.
     * @returns {boolean} - The result of the assertion.
     */
    get containsTemplate(): boolean {
        const values = Array.isArray(this.value) ? this.value : [ this.value ]; 

        return values.every(value => {
            return typeof value === 'object' && value !== null &&
                value.constructor.name === "Template";
        });
    }

    /**
     * stringValue property getter returns a string version of the current 
     * {@link Slot} value.
     * @returns {string} - The result of the casting.
     */
    private get stringValue(): string {
        return Array.isArray(this.value) ? 
            this.value.join(" ") : String(this.value);
    }

    /**
     * Slot constructor assings the provided arguments to the current instance 
     * properties.
     * @param {number} index The {@link Slot} index into a {@link Template}.
     * @param {*} value The current {@link Slot} value.
     * @param {string=} attr If the current {@link Slot} is an attribute of a 
     * HTMLElement it defines the attribute name.
     */
    constructor(index: number, value: any, attr?: string) {
        this.slotIndex = index;
        this.attr = attr;
        this.value = value;
    }

    /**
     * commit function checks the current {@link Slot} to decide if it is a HTML
     * attribute, a interpolation value, another {@link Template} or a group of
     * them, and calls the specific commit function by the detected {@link Slot}
     * type. If the {@link Slot} is a group of {@link Templates} its necessary 
     * to get the end {@link Slot} mark iterating over the start mark siblings.
     * @param {Node} startMark The start {@link Slot} mark, generated during the
     * {@link Template} creation.
     */
    public commit(startMark: Node): void {
        /**
         * If {@link Slot} is not an attribute it will need a node type commit, 
         * else it calls to {@link Processor.commitAttr}.
         */
        if (!this.isAttr) {
            /**
             * If the {@link Slot} has an array of values it calls to
             * {@lin Processor.renderNodes}, else calls to 
             * {@link Processor.renderNode}.
             */
            const slotValue = this.value;
            if (Array.isArray(slotValue) && this.containsTemplate) {
                /**
                 * Gets the referenced slot and its values. If a {@link Slot} 
                 * has an array of values, it's possible that more than one 
                 * Node could be affected. Iterate over curent 
                 * Node siblings looking for HTMLElement.
                 */
                const slotNodes: Array<Node> = [];
                let endMark: Node = startMark.nextSibling;
                while (!isEndMark(endMark)) {
                    slotNodes.push(endMark);
                    endMark = endMark.nextSibling;
                }
                this.commitTemplates(slotNodes, startMark, endMark);
            } else {
                const node: Node = startMark.nextSibling;
                if (this.containsTemplate) this.commitTemplate(node, startMark);
                else this.commitValue(node, startMark);
            }
        } else this.commitAttr(startMark.nextSibling);
    }

    /**
     * commitAttr function updates the current {@link Slot} as a HTML attribute
     * of the provided Node. It checks if the attribute value
     * is distinct that the new one before update it.
     * @param {Node} node The target Node to update.
     */
    private commitAttr(node: HTMLElement | Node): void {
        const [ attr, value ] = [ this.attr, this.stringValue ];
        const current = (node as HTMLElement).getAttribute(attr);
        if (current !== value) (node as HTMLElement).setAttribute(attr, value);
    }

    /**
     * commitValue updates a {@link Node.TEXT_NODE} content with the value
     * provided as argument. If the provided Node is not created yet, 
     * it will create it before the {@link Slot} startMark and setted with the 
     * provided value.
     * @param {Node} node The target Node to update.
     * @param {Node} startMark The Comment that references the start of the
     * {@link Slot}.
     * @param {*} value The value to commit into the Node.
     */
    private commitValue(node: Node, startMark: Node): void {
        const value = this.stringValue;

        if (node === undefined || node === null) {
            startMark.parentNode.insertBefore(
                document.createTextNode(value), 
                startMark.nextSibling
            );
        } else if (node.nodeValue !== value) node.nodeValue = value;
    }

    /**
     * commitTemplate updates a Node content with the correct 
     * {@link Template} instance. If the provided Node is `undefined`,
     * it will create a new one with the {@link Template.element}. If it is a
     * {@link Slot} end mark it will append it before this mark. Lastly, if the
     * current Node does not match with the new {@link Template},
     * replace it with the new one. Else, updates the {@link Template} into the
     * Node provided.
     * @param {Node} node The target Node to update.
     * @param {Node} startMark The Comment that references the
     * start of the {@link Slot}.
     * @param {Template} template The {@link Template} to commit into the 
     * Node.
     */
    private commitTemplate(node: Node, startMark: Node, childTemplate?: Template) {
        const template = childTemplate || this.value as Template;
        if (node === undefined) {
            startMark.parentNode.insertBefore(template.element, startMark.nextSibling);
        } else if (isEndMark(node)) {
            node.parentNode.insertBefore(template.element, node);
        } else if (template.match(node)) {
            new Processor(template, node).render();
        } else node.parentNode.replaceChild(template.element, node);
    }

    /**
     * commitTemplates function iterates over the {@link Slot} values as 
     * {@link Template}'s and its Node's commiting the changes. If
     * any Node has not a asigned {@link Template} it will be removed.
     * Else, it calls iteratively {@link Slot.commitTemplate}.
     * @param {Array<Node>} nodes The target Nodes to update.
     * @param {Node} startMark The Comment that references the
     * start of the {@link Slot}.
     * @param {Node} endMark The Comment that references the
     * end of the {@link Slot}.
     * @param {Array<Template>} templates The {@link Template}s to commit into 
     * the Nodes.
     */
    private commitTemplates(nodes: Array<Node>, startMark: Node, endMark: Node): void {
        /**
         * Get the current templates from the slot value and calculate the limit
         * of the iteration that is the highest length between the nodes list 
         * and values list.
         */
        const templates = this.value as Array<Template>;
        const templatesLength: number = templates.length,
            nodesLength: number = nodes.length,
            limit: number = templatesLength > nodesLength ? 
                templatesLength : nodesLength;

        for (let i: number = 0; i < limit; i++) {
            const [ node, template ] = [nodes[i], templates[i] ];
            /**
             * If the current Node has not value, remove the current 
             * Node. Throws an error if any of {@link Slot} values is 
             * not a Template instance. 
             */
            if (template !== undefined) {
                if (template.constructor.name !== "Template")
                    throw NotTemplateErr({ node, template });
                /**
                 * If the current Node is `undefined` use the 
                 * {@link Slot} end mark as target.
                 */
                this.commitTemplate(node || endMark, startMark, template);
            } else if (node !== undefined) node.parentNode.removeChild(node);
        }
    }
}

export { Slot };