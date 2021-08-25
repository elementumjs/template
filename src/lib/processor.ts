import { SlotNotFoundError } from "./error";

import type { Slot } from "./slot"; 
import type { Template } from "./template";

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
     * getSlot method iterates over the current template definition slots
     * searching for a slot with the same index that the provided one.
     * @param {number} slotIndex The index of the slot to search.
     * @returns {Slot} - The desired slot.
     */
    private getSlot(index: number): Slot {
        // Iterates over the template slots to get the correct one by provided
        // index.
        const { length } = this.template.slots;
        for (let i: number = 0; i < length; i++) {
            // Search for the slot with the current index.
            const slot: Slot = this.template.slots[i];
            if (slot.slotIndex === index) return slot;
        }
        throw SlotNotFoundError({
            template: this.template,
            slot: index
        });
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
        let current: Node = walker.nextNode();
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
            const slotIndex: number = parseInt(current.nodeValue);
            
            // The template slots have consecutive slot indexes, so the next 
            // valid slot must have a higher slot index than the previous one. 
            // If not, the next slot is relative to another child template.
            if (slotIndex > lastSlotIndex) {
                const slot: Slot = this.getSlot(slotIndex);
                slot.commit(current);
                lastSlotIndex = slotIndex;
            }
            current = walker.nextNode();
        }
    }
}

export { Processor };