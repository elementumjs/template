import { Template, Slot } from "./template";

/**
 * acceptNode its a function to filter Comment nodes with a number as nodeValue.
 * This kind of Comments represents the template slot marks. 
 * @param {Node} node - Node candidate to filter.
 * @returns {boolean} Returns if node provided is allowed.
 */
const acceptNode = (node: Node): number => {
    const { nodeType, nodeValue } = node;

    return nodeType === Node.COMMENT_NODE && !!parseInt(nodeValue) ?
        NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
}

/**
 * Processor class interprets a template, renders, and updates its slots into a 
 * provided container. It checks if the template has not rendered yet into the 
 * container and inject it into the container. If it is already rendered, 
 * iterates over its slots and checks if they have changed to update them.
 */
class Processor {
    template: Template;
    container: HTMLElement;

    /**
     * Processor constructor receives the template to process and the container 
     * where it will be rendered.
     * {@link HTMLElement}.
     * @param {Template} template - The template to process.
     * @param {HTMLElement} container - The container to render the template.
     */
    constructor(template: Template, container: HTMLElement) {
        this.template = template;
        this.container = container;
    }

    /**
     * render checks if the template is already rendered into the container 
     * after injecting it. If it was rendered, it iterates over template slots 
     * to render them. If it was not rendered, it appends the template to the 
     * container.
     */
    render() {
        // Creates a {@link TreeWalker} to iterates over container child nodes.
        // It uses acceptFilter to get the slot marks ({@link Comment} elements 
        // that includes an index).
        const walker: NodeIterator = document.createNodeIterator(
            this.container,
            NodeFilter.SHOW_COMMENT,
            { acceptNode }
        );

        // Gets the first mark founded to check if the container has the 
        // template already rendered.
        let current = walker.nextNode();
        if (current === null) {
            // If the first mark founded is null, the template was not detected 
            // and it is appended to the container.
            const range: Range = document.createRange();
            const html: DocumentFragment = range.createContextualFragment(this.template.html);
            this.container.appendChild(html);
            return;
        }

        while (current) {
            // Iterate over the found marks getting their slot index and 
            // committing the current node (the sibling of the {@link Node}
            // mark).
            const { nodeValue } = current;
            const slotIndex: number = parseInt(nodeValue);
            this.commitNode(current.nextSibling, slotIndex);

            current = walker.nextNode();
        }
    }

    /**
     * commitNode gets the slot referenced by the index and compares its value
     * with the target node value. If its not equal, the target node will be 
     * updated.
     * @param {Node} node - The target node of the slot.
     * @param {number} slotIndex - The index of the slot referenced.
     */
    commitNode(node: HTMLElement | Node, slotIndex: number) {
        // Iterates over the template slots to get the correct one by slotIndex
        // provided.
        const { length } = this.template.slots;
        for (let i = 0; i < length; i++) {
            // Checks if current slot has the same slotIndex that the provided.
            const slot: Slot = this.template.slots[i];
            if (slot.slotIndex === slotIndex) {
                // If a slot is found, gets the current attr and value slot
                // parameters.
                const { attr, value } = this.template.slots[i];

                // If the slot attr parameter is not undefined, the slot is an 
                // attr. It gets the current attribute value to compare with the
                // slot value, if its not equal, the node attribute is updated.
                // If the slot is an interpolation, compares its value with the
                // slot value, if they are not equal, the target value is 
                // updated with the new one.
                if (attr !== null) {
                    const current = (node as HTMLElement).getAttribute(attr);
                    if (current !== value) (node as HTMLElement).setAttribute(attr, value);
                } else if (node.nodeValue !== value) {
                    // If the initial slot value is empty no text node is 
                    // created, and the provided node as target is the end 
                    // commment mark, so initalizes the target text node with 
                    // the value and insert before the end comment mark.
                    if (node.nodeType !== Node.COMMENT_NODE) node.nodeValue = value;
                    else node.parentNode.insertBefore(document.createTextNode(value), node);
                }
            }
        }
    }
}

export { Processor };