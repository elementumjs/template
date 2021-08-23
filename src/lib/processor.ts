import { Template, Slot, endMarkNeedle } from "./template";

/**
 * acceptNode its a function to filter Comment nodes with a number as nodeValue.
 * This kind of Comments represents the start of a template slot. 
 * @param {Node} node - Node candidate to filter.
 * @returns {number} Returns if node provided is allowed between 
 * {@link NodeFilter.FILTER_ACCEPT} and {@link NodeFilter.FILTER_REJECT}.
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
 * @class Processor
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
     * render checks if the template is already rendered into the container 
     * after injecting it. If it was rendered, it iterates over template slots 
     * to render them. If it was not rendered, it appends the template to the 
     * container.
     */
    public render(): void {
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
                const slot: Slot = this.getSlotByIndex(slotIndex);

                // If {@link Slot} is not an attribute it will need a node type
                // commit, else it calls to {@link Processor.commitAttr}.
                if (!slot.isAttr) {
                    // If the {@link Slot} has an array of values it calls to
                    // {@lin Processor.commitNodes}, else calls to 
                    // {@link Processor.commitNode}.
                    if (Array.isArray(slot.value)) {
                        // If a {@link Slot} has an array of values, it's 
                        // possible that more than one {@link Node} could be
                        // affected. Iterate over curent {@link Node} siblings
                        // looking for {@link Node.ELEMENT_NODE}.
                        const slotNodes: Array<Node> = [];
                        let currentSibling: Node = current.nextSibling;
                        while (
                            currentSibling !== null &&
                            currentSibling.nodeType === Node.ELEMENT_NODE
                        ) {
                            slotNodes.push(currentSibling);
                            currentSibling = currentSibling.nextSibling;
                        }
                        
                        // Call {@link Proccesor.commitNodes} passing the 
                        // current {@link Node} as {@link Slot} starter mark.
                        this.commitNodes(slotNodes, current, slot);
                    } else this.commitNode(current.nextSibling, slot);
                } else this.commitAttr(current.nextSibling, slot);
                lastSlotIndex = slotIndex;
            }
            current = walker.nextNode();
        }
    }

    /**
     * 
     * @param node 
     * @param slot 
     */
    private commitAttr(node: HTMLElement | Node, slot: Slot): void {
        const { attr } = slot;
        const value = Array.isArray(slot.value) ? slot.value.join(" ") : slot.value;

        const current = (node as HTMLElement).getAttribute(attr);
        if (current !== value) (node as HTMLElement).setAttribute(attr, value);
    }

    /**
     * commitNode gets the slot referenced by the index and compares its value
     * with the target node value. If its not equal, the target node will be 
     * updated.
     * @param {Node} node - The target node of the slot.
     * @param {Slot} slot - The index of the slot referenced.
     */
    private commitNode(node: HTMLElement | Node, slot: Slot): void {
        // If the value is another {@link Template} and the current html 
        // definition is not equal that the new one, creates a new
        // {@link Processor} with the {@link Template} instance and 
        // the current node as container. 
        // If the slot is an interpolation, compares its value with the
        // slot value, if they are not equal, the target value is 
        // updated with the new one.
        const { value } = slot;
        if (value instanceof Template) {
            // Compare the html defintion of the current node with the new one 
            // before update it.
            const current = (node as HTMLElement).outerHTML;
            if (!current) node.parentNode.insertBefore(value.element, node);
            else if (value.regexp.test(current)) new Processor(value, node).render();
            else node.parentNode.replaceChild(value.element, node);
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
     * @param {Slot} slot The index of the slot.
     */
    private commitNodes(slotNodes: Array<Node>, markNode: Node, slot: Slot): void {
        // Gets the referenced slot and its values.
        const slotValues: Array<any> = slot.value;

        // Calculate the limit of the iteration that is the highest length 
        // between the nodes list and values list.
        const valuesLength: number = slotValues.length;
        const nodesLength: number = slotNodes.length;
        const limit: number = valuesLength > nodesLength ? 
            valuesLength : nodesLength;

        // Iterate over values and nodes. 
        for (let i: number = 0; i < limit; i++) {
            const [ node, value ] = [ slotNodes[i], slotValues[i] ];
            
            // Throws an error if any of slot values is not a Template instance. 
            if (value !== undefined && !(value instanceof Template)) {
                const error = 'to render a template into a list, every list '+ 
                    'items must be a Template instance.';
                throw new Error(error);
            }

            // If a iteration step has not a target node it will be a new 
            // element. If a iteration step has not a slot value associated, the
            // target node must be removed. If a iteration step has both args, 
            // the target node and the slot value, the target node is updated.
            if (value === undefined) node.parentNode.removeChild(node);
            else if (node === undefined) {
                // Get the last {@link Node} of the slot to get the 
                // {@link Node.parentNode} from it. Then create the value 
                // element into the {@link Node.parentNode} before the 
                // {@link Node.nextSibling} of the last {@link Node}. If the
                // {@link Node.nextSibling} is `undefined`, 
                // {@link Node.insertBefore()} will insert the element at the 
                // end of the parent {@link Node.childNodes}.
                const prevNode = slotNodes[i - 1] || markNode;
                prevNode.parentNode.insertBefore(value.element, prevNode.nextSibling);
            } else this.commitNode(node, value);
        }
    }
}

export { Processor };