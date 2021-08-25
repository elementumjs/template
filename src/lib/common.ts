/**
 * openingHint string contains and empty Comment representation. 
 */
export const openingHint: string = "<";

/**
 * endMarkNeedle string contains the nodeValue of the comment nodes that mark 
 * the end of a slot.
 */
export const endMarkNeedle: string = "-";

/**
 * markGenerator function returns a HTML comment string definition with the slot
 * mark content as value.
 * @param {*} needle - Content to place into the mark
 */
export const markGenerator = (needle: any): string => `<!--${ needle }-->`;

/**
 * 
 * @param part 
 * @returns 
 */
export const escapePart = (part: string): string => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Regex expressions to detect attributes name and its prefix.
 */ 
const attributeNameAndPrefixRgx: RegExp = /\s(\S+)\=[\"\']([^\"]*)$/;
export const startAttrParser = (part: string): Array<string> => {
    const result: RegExpExecArray = attributeNameAndPrefixRgx.exec(part);
    return result !== null ? [ result[1], result[2] ] : null;
}


/**
 * Regex expressions to catchs the slot attribute sufix.
 */
const attributeSufixRgx: RegExp = /^([^\"]*)[\"|\'][\s|\>]/;
export const endAttrParser = (part: string): string => {
    const result: RegExpExecArray = attributeSufixRgx.exec(part);
    return result !== null ? result[1] : null;
}

/**
 * acceptNode its a function to filter Comment nodes with a number as nodeValue.
 * This kind of Comments represents the start of a template slot. 
 * @param {Node} node - Node candidate to filter.
 * @returns {number} Returns if node provided is allowed between 
 * {@link NodeFilter.FILTER_ACCEPT} and {@link NodeFilter.FILTER_REJECT}.
 */
export const acceptNode = (node: Node): number => {
    const { nodeType, nodeValue } = node;
    return nodeType === Node.COMMENT_NODE && !!parseInt(nodeValue) ?
        NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
}