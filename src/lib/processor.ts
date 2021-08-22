import { Template, Slot, endMarkNeedle } from "./template";

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
    container: HTMLElement | Node;

    /**
     * Processor constructor receives the template to process and the container 
     * where it will be rendered.
     * {@link HTMLElement}.
     * @param {Template} template - The template to process.
     * @param {HTMLElement} container - The container to render the template.
     */
    constructor(template: Template, container: HTMLElement | Node) {
        this.template = template;
        this.container = container;
    }

    /**
     * render checks if the template is already rendered into the container 
     * after injecting it. If it was rendered, it iterates over template slots 
     * to render them. If it was not rendered, it appends the template to the 
     * container.
     */
    render(): void {
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
            this.container.appendChild(this.template.element);
            return;
        }

        let lastSlotIndex: number = 0;
        while (current) {
            // Iterate over the found marks getting their slot index and 
            // committing the current node (the sibling of the {@link Node}
            // mark).
            const { nodeValue } = current;
            const slotIndex: number = parseInt(nodeValue);
            
            // The template slots have consecutive slot indexes, so the next 
            // valid slot must have a higher slot index than the previous one. 
            // If not, the next slot is relative to another child template.
            if (slotIndex > lastSlotIndex) {
                // A slot could have more than one node affected, such as the 
                // lists of elements. So it is necessary to search for all the 
                // slot nodes iterating over siblings until catch an end mark 
                // comment node.
                let currentSibling: Node = current.nextSibling;
                const slotNodes: Array<Node> = [];
                while (
                    currentSibling.nodeType !== Node.COMMENT_NODE &&
                    currentSibling.nodeValue !== endMarkNeedle
                ) {
                    slotNodes.push(currentSibling);
                    currentSibling = currentSibling.nextSibling;
                }

                // If more than one node is found, all of them are committed, 
                // if only one is found it is committed individually.
                if (slotNodes.length > 1) this.commitNodes(slotNodes, slotIndex);
                else this.commitNode(current.nextSibling, slotIndex);
                lastSlotIndex = slotIndex;
            }

            current = walker.nextNode();
        }
    }

    /**
     * getSlotByIndex method iterates over the current template definition slots
     * searching for a slot with the same index that the provided one.
     * @param {number} slotIndex The index of the slot to search.
     * @returns {Slot} - The desired slot.
     */
    private getSlotByIndex(slotIndex: number): Slot {
        // Iterates over the template slots to get the correct one by provided
        // index.
        let slot: Slot;
        const { length } = this.template.slots;
        for (let i: number = 0; i < length; i++) {
            // Search for the slot with the current index.
            slot = this.template.slots[i];
            if (slot.slotIndex === slotIndex) return slot;
        }

        throw new Error('slot not found');
    }

    /**
     * commitNode gets the slot referenced by the index and compares its value
     * with the target node value. If its not equal, the target node will be 
     * updated.
     * @param {Node} node - The target node of the slot.
     * @param {number} slotIndex - The index of the slot referenced.
     */
    private commitNode(node: HTMLElement | Node, slotIndex: number): void {
        // Search for the slot and gets the current attr and value slot 
        // parameters.
        const slot: Slot = this.getSlotByIndex(slotIndex);
        const { attr, value } = slot;

        // If the slot value is an array, creates an array of nodes and 
        // commit all the values at the same time.
        // If the value is another {@link Template} and the current html 
        // definition is not equal that the new one, creates a new
        // {@link Processor} with the {@link Template} instance and 
        // the current node as container. 
        // If the slot attr parameter is not undefined, the slot is an 
        // attr. It gets the current attribute value to compare with the
        // slot value, if its not equal, the node attribute is updated.
        // If the slot is an interpolation, compares its value with the
        // slot value, if they are not equal, the target value is 
        // updated with the new one.
        if (Array.isArray(value)) this.commitNodes([ node ], slotIndex);
        else if (value instanceof Template) {
            const current = (node as HTMLElement).outerHTML;
            if (current !== value.html) new Processor(value, node).render();
        } else if (attr !== null) {
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

    /**
     * commitNodes gets the slot referenced by the index and compares its values
     * with the targets nodes values. If any of them is not equal, the target 
     * node will be updated.
     * @param {Array<Node>} slotNodes The list of the slot nodes.
     * @param {number} slotIndex The index of the slot.
     */
    private commitNodes(slotNodes: Array<Node>, slotIndex: number): void {
        // Gets the referenced slot and its values.
        const slot: Slot = this.getSlotByIndex(slotIndex);
        const slotValues: Array<any> = slot.value;

        // Calculate the limit of the iteration that is the highest length 
        // between the nodes list and values list.
        const valuesLength: number = slotValues.length;
        const nodesLength: number = slotNodes.length;
        const limit: number = valuesLength > nodesLength ? 
            valuesLength : nodesLength;

        // Iterate over values and nodes updating them. It throw an error if any
        // of slot values is not a Template instance. If a iteration step has 
        // not a target node it will be a new element. If a iteration step has
        // not a slot value associated, the target node must be removed. If a
        // iteration step has both args, the target node and the slot value,
        // the target node is updated.
        for (let i: number = 0; i < limit; i++) {
            const [ node, value ] = [ slotNodes[i], slotValues[i] ];
            if (!(value instanceof Template)) {
                const error = 'to render a template into a list, every list '+ 
                    'items must be a Template instance.';
                throw new Error(error);
            }

            if (node !== undefined && value !== undefined) {
                const current = (node as HTMLElement).outerHTML;
                if (current !== value.html) new Processor(value, node).render();
            } else if (node === undefined) {
                const prevNode = slotNodes[i - 1];
                prevNode.parentNode.insertBefore(value.element, prevNode.nextSibling);
            } else node.parentNode.removeChild(node);
        }
    }
}

export { Processor };