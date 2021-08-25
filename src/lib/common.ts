/**
 * openHint the initial character of a {@link Node.ELEMENT_NODE} string 
 * representation. It allows to find the correct position into a string part for
 * a start {@link Slot} mark.
 */
export const openHint: string = "<";

/**
 * endHint string contains the {@link Node.nodeValue} of the comment nodes 
 * that mark the end of a {@link Slot}.
 */
export const endHint: string = "-";

/**
 * markGenerator function returns a {@link Node.COMMENT_NODE} string definition 
 * with the slot mark content as value.
 * @param {*} hint - Content to place into the mark. By default 
 * {@link endHint}.
 */
export const markGenerator = (hint: any = endHint): string => `<!--${ hint }-->`;

/**
 * escapePart return an escaped version of the provided string to use it into a
 * {@link RegExp} definition without special characters errors.
 * @param {string} part The string part to escape.
 * @returns {string} - The escaped part string.
 */
export const escapePart = (part: string): string => {
    return part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** 
 * attrPrefixRgx contains a {@link RegExp} to detect attributes and get name and 
 * it prefix from a string. Ex.: From `<div foo="bar ` gets `foo` & `bar `.
 */ 
const attrPrefixRgx: RegExp = /\s(\S+)\=[\"\']([^\"]*)$/;

/**
 * startAttrParser function parses a part string like the start of an HTML 
 * attribute string representation. If the provided part is not an attribute, 
 * it returns `null`. Else, returns a the name of the attribute and the prefix 
 * part from its content. 
 * @param {string} part The part to parse.
 * @returns {Array<string>} - The result of the parse process.
 */
export const startAttrParser = (part: string): Array<string> => {
    const result: RegExpExecArray = attrPrefixRgx.exec(part);
    return result !== null ? [ result[1], result[2] ] : null;
}

/**
 * Regex expressions to catchs the {@link Slot} attribute suffix. 
 * Ex.: From ` bar" foo2="bar2">` gets ` bar`.
 */
const attrSufixRgx: RegExp = /^([^\"]*)[\"|\'][\s|\>]/;

/**
 * endAttrParser function parses a part string like the end of an HTML attribute 
 * representation. If the provided part is not an attribute, it returns `null`. 
 * Else, returns the attribute content suffix. 
 * @param {string} part The part to parse.
 * @returns {string} - The result of the parse process.
 */
export const endAttrParser = (part: string): string => {
    const result: RegExpExecArray = attrSufixRgx.exec(part);
    return result !== null ? result[1] : null;
}