import { NotSlotErr } from "./error";

import type { Slot } from "./slot"; 
import type { Template } from "./template";

/**
 * acceptNode its a function to filter Comment nodes with a number as nodeValue.
 * This kind of Comments represents the start of a template slot. 
 * @param {Node} node - Node candidate to filter.
 * @returns {number} Returns if node provided is allowed between 
 * NodeFilter.FILTER_ACCEPT and NodeFilter.FILTER_REJECT.
 */
const acceptNode = (node: Node): number => {
    const { nodeType, nodeValue } = node;
    return nodeType === Node.COMMENT_NODE && !!parseInt(nodeValue) ?
        NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
}

/**
 * Processor class interprets a {@link Template}, renders, and updates its slots
 * into a provided container Node. It checks if the {@link Template} has
 * not rendered yet into the container and inject it into the container 
 * Node. If it is already rendered, iterates over its {@link Slot}s and 
 * checks if they have changed to update them.
 * @class Processor
 */
class Processor {
    /** The {@link Template} instance to process. */
    template: Template;
    /** The container Node to render the {@link Template}. */
    container: HTMLElement | Node;

    /**
     * Processor constructor receives the {@link Template} to process and the 
     * container where it will be rendered.
     * HTMLElement.
     * @param {Template} template - The {@link Template} instance to process.
     * @param {Node | HTMLElement} container - The container Node to 
     * render the {@link Template}.
     */
    constructor(template: Template, container: HTMLElement | Node) {
        this.template = template;
        this.container = container;
    }

    /**
     * getSlot method iterates over the current template definition 
     * {@link Slot}'s searching for a {@link Slot} with the same index that the 
     * provided one.
     * @param {number} slotIndex The index of the {@link Slot} to search.
     * @returns {Slot} - The desired slot.
     */
    private getSlot(index: number): Slot {
        /**
         * Iterates over the template {@link Slot}'s to get the correct one by 
         * provided index.
         */
        const { length } = this.template.slots;
        for (let i: number = 0; i < length; i++) {
            /** Search for the {@link Slot} with the current index. */
            const slot: Slot = this.template.slots[i];
            if (slot.slotIndex === index) return slot;
        }
        throw NotSlotErr({
            template: this.template,
            slot: index
        });
    }

    /**
     * render checks if the template is already rendered into the container 
     * after injecting it. If it was rendered, it iterates over template 
     * {@link Slot}'s to commit them. If it was not rendered, it appends 
     * the {@link Template} to the container.
     */
    public render(): void {
        /**
         * Creates a TreeWalker to iterates over container child nodes.It uses 
         * {@link acceptNode} to get the {@link Slot} marks (Comment elements 
         * that includes an index).
         */
        const walker: NodeIterator = document.createNodeIterator(
            this.container,
            NodeFilter.SHOW_COMMENT,
            { acceptNode }
        );
        
        /**
         * Gets the first mark founded to check if the container has the 
         * {@link Template} already rendered.
         */
        let current: Node = walker.nextNode();
        if (current === null) {
            /**
             * If the first mark was founded is null, the {@link Template} was 
             * not detected and append it to the container.
             */
            this.container.appendChild(this.template.element);
            return;
        } 

        /**
         * Store the last founded {@link Slot} slot index because the 
         * {@link Slot}'s of a {@link Template} have consecutive indexes, so the
         * next valid {@link Slot} must have a higher {@link Slot} index than 
         * the previous one. If not, the next {@link Slot} is relative to 
         * another child {@link Template}.
         */
        let lastSlotIndex: number = 0;
        while (current) {
            /**
             * Iterate over the found marks getting their {@link Slot} index and 
             * committing the current Node (the sibling of the 
             * Node mark).
             */
            const slotIndex: number = parseInt(current.nodeValue);
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