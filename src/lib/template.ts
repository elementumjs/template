/**
 * Slot object abstracts a fillable slot of a template.
 */
interface Slot {
    /** The attribute index */
    slotIndex: number;
    /** The attribute name */
    attr?: string;
    /** The value of the field */
    value: any;
}

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

/**
 * Regex expressions to detect attributes name and its prefix.
 */ 
const attributeNameAndPrefixRgx: RegExp = /\s(\S+)\=[\"\']([^\"]*)$/;

/**
 * Regex expressions to catchs the slot attribute sufix.
 */
const attributeSufixRgx: RegExp = /^([^\"]*)[\"|\'][\s|\>]/;

/**
 * Template class abstracts the current template strings, args and slots.
 * @class Template
 */
class Template {
    strings: Array<string>;
    slots: Array<Slot>;

    /**
     * Creates the {@link Template}, initializes some internal variables and 
     * starts the building process.
     * @param {string[]} strings - The literal string tag strings
     * @param {Object|Array} values - The literal string tag args
     */
    constructor(strings: Array<string>, values: Array<any> = []) {
        this.strings = strings;
        this.slots = [];

        this.prepare(values);
    }

    /**
     * html function returns the string definition of the template, including
     * the slots marks (attributes and interpolation marks) and the value of
     * the slots injected.
     * @returns {string} The composed html string definition.
     */
    get html(): string {
        // Creates a variable to store the html string definition and append the
        // formated part in each iteration.
        let htmlDef: string = "";

        // Iterates over strings items appending its slot value. If the slot is 
        // an interpolation, the end mark is appended after slot value.
        const last: number = this.strings.length - 1;
        for (let i = 0; i < last; i++) {
            // Gets attribute and value parameter of the slot and append it to 
            // the after the current string.
            let { attr, value } = this.slots[i];
            // If the value is an array, it joins each string representation.
            if (Array.isArray(value)) value = value.join("");

            htmlDef += this.strings[i] + value;

            // Checks if is an interpolation to append to it the end mark.
            // An end mark is a HTML Comment with a dash as content.
            if (attr === null) htmlDef += markGenerator(endMarkNeedle);
        }
        
        // Returns the result of the iterations, appending to it the last 
        // string part.
        return htmlDef + this.strings[last];
    }
    
    /**
     * element returns a generated DocumentFragment element with the template
     * html definition inside of it.
     * @returns {DocumentFragment} The generated HTML element.
     */
    get element(): DocumentFragment {
        const range: Range = document.createRange();
        return range.createContextualFragment(this.html);
    }
    
    /**
     * Returns the composed template definition as string.
     * @returns {string} The composed html string definition.
     */
    toString(): string { return this.html; }
    
    /**
     * prepare functions detect the slots in the current template, its type 
     * between interpolation and attribute, and the slot index. Iterates over 
     * the template strings composing each slot.
     * @param {Array} values - The current values of the slots
     */
    private prepare(values: Array<any>) {
        // Creates a variable to store the current slot index and iterates over
        // template strings identifying the current slot and parse it.
        let slotIndex: number = 0;
        let length: number = this.strings.length - 1;
        for (let i = 0; i < length; i++) {
            // Gets the current string and value to create the slot.
            const part: string = this.strings[i];
            let value: any = values[i];

            // When slot value its a function, removes de function body and 
            // keeps the function name as reference.
            if (typeof value === 'function') {
                const name = (value as Function).name;
                if (name === '') {
                    const error = 'injected functions cannot be inlined.' +
                        'Please define the function outside and reference it ' +
                        'by its name. Ex.: <button onclick="${fn}">';
                    throw new Error(error);
                }
                value = `${name}()`;
            }

            // Checks if the current string is an attribute using a {@link Regex}.
            const result: RegExpExecArray = attributeNameAndPrefixRgx.exec(part);
            if (result !== null) {
                // If it is an attribute, identifies the initial position of the
                // opening {@link Node} character to mark the element. If it's
                // the first attribute slot of the {@link Node}, updates the 
                // current slot index to the new one.
                const pos: number = part.lastIndexOf(openingHint);
                if (pos != -1) slotIndex++;

                // If the opening character is in the first position of the 
                // string, updates the string with the mark and its index. If
                // not, insert the mark between the parts of the string splited
                // by the initial character.
                if (pos === 0) {
                    this.strings[i] = markGenerator(slotIndex) + part; 
                } else if (pos > 0) {
                    const start: string = part.substring(0, pos - 1);
                    const end: string = part.substring(pos);
                    
                    this.strings[i] = start + markGenerator(slotIndex) + end;
                }
                
                // Gets the attribute name and store the slot.
                const attr: string = result[1];

                // Get prefix value of slot attribute.
                const prefix: string = result[2];
                const prefixPos: number = this.strings[i].length - prefix.length;
                this.strings[i] = this.strings[i].slice(0, prefixPos);
                
                // Gets the following parts that belong to the same slot 
                // attribute. Gets the next part and checks if contains the end 
                // of the attribute definition. While it does not contain the 
                // end, iterates over the following parts to find it.
                let following: string = "";
                let next: string = this.strings[i + 1];
                let endOfAttribute: RegExpExecArray = attributeSufixRgx.exec(next);
                while (endOfAttribute === null) {
                    // In every iteration, stores the followings values and 
                    // parts to append it to the slot.
                    following += next + values[i + 1];
                    
                    // Updates the strings and values list deleting the 
                    // following items and updates the loop limit.
                    this.strings.splice(i + 1, 1);
                    values.splice(i + 1, 1);
                    length--;

                    // Updates the next part and does the check again.
                    next = this.strings[i + 1];
                    endOfAttribute = attributeSufixRgx.exec(next);
                }

                // Once the end of the attribute is found, it gets the suffix 
                // substring part of the next one and updates it.
                const suffix: string = endOfAttribute[1];
                this.strings[i + 1] = next.slice(suffix.length);

                // Stores the slot composing its value withe the current value,
                // its prefix, the following components of the attribute and its
                // suffix.
                this.slots.push({ 
                    slotIndex, 
                    attr, 
                    value: prefix + value + following + suffix 
                });
            } else {
                // If it is an interpoltation, the string is updated with the
                // mark and its index, the slot index is updated and the slot 
                // is stored.
                slotIndex++;
                this.strings[i] = part + markGenerator(slotIndex);
                this.slots.push({ slotIndex, attr: null, value });
            }
        }
    }
}

export { Slot, Template, endMarkNeedle };
