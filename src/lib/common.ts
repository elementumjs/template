/**
 * openingHint string contains and empty Comment representation. 
 */
const openingHint: string = "<";

/**
 * endMarkNeedle string contains the nodeValue of the comment nodes that mark 
 * the end of a slot.
 */
const endMarkNeedle: string = "-";

/**
 * markGenerator function returns a HTML comment string definition with the slot
 * mark content as value.
 * @param {*} needle - Content to place into the mark
 */
const markGenerator = (needle: any): string => `<!--${ needle }-->`;

const escapePart = (part: string): string => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Regex expressions to detect attributes name and its prefix.
 */ 
const attributeNameAndPrefixRgx: RegExp = /\s(\S+)\=[\"\']([^\"]*)$/;

/**
 * Regex expressions to catchs the slot attribute sufix.
 */
const attributeSufixRgx: RegExp = /^([^\"]*)[\"|\'][\s|\>]/;

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

export {
    openingHint,
    endMarkNeedle,
    markGenerator,
    escapePart,
    attributeNameAndPrefixRgx,
    attributeSufixRgx,
    acceptNode
}