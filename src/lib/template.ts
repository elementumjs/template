import {
    openHint,
    markGenerator,
    escapePart,
    startAttrParser,
    endAttrParser
} from "./globals";
import { InlineFnErr, EmptyTemplateSlots } from "./error";

import { Slot } from "./slot";

/**
 * Template class abstracts the current template strings, args and slots.
 * @class Template
 */
class Template {
    /** The parts of the {@link Template}. */
    strings: Array<string>;
    /** The list of {@link Slot}'s of the {@link Template}. */
    slots: Array<Slot>;

    /**
     * Creates the {@link Template}, initializes some internal variables and 
     * starts the building process.
     * @param {string[]} strings - The parts of the {@link Template}.
     * @param {Object|Array} values - The literal strings values.
     */
    constructor(strings: Array<string>, values: Array<any> = []) {
        this.strings = strings;
        this.slots = [];

        if (this.strings.length <= 1) throw EmptyTemplateSlots(strings);

        this.prepare(values);
    }

    /**
     * regexp getter function returns a composed RegExp of the current element 
     * to check if any HTMLElement match with the current {@link Template} and 
     * its {@link Slot} areas.
     * @returns {RegExp} - The composed RegExp of the current 
     * {@link Template}.
     */
    private get regexp(): RegExp {
        /**
         * Creates a variable to store the html string definition and append the
         * formated part in each iteration.
         */
        let htmlDef: string = "";

        /**
         * Iterates over strings items appending its parts escaped and a pattern 
         * to detect {@link Slot} areas. Closing {@link Slot} interpolations 
         * with a end mark using ({@link markGenerator}).
         */
        const last: number = this.strings.length - 1;
        for (let i = 0; i < last; i++) {
            htmlDef += escapePart(this.strings[i]) + "(.*)";
            if (!this.slots[i].isAttr) 
                htmlDef += escapePart(markGenerator());
        }

        /**
         * Returns the result of the iterations, appending to it the last 
         * string part.
         */
        htmlDef += escapePart(this.strings[last]);
        return new RegExp(htmlDef);
    }

    /**
     * html function returns the string definition of the template, including
     * the {@link Slot}'s marks (attributes and interpolation marks) and the 
     * value of the {@link Slot}'s injected.
     * @returns {string} The composed html string definition.
     */
    get html(): string {
        /**
         * Creates a variable to store the html string definition and append the 
         * formated part in each iteration.
         */
        let htmlDef: string = "";

        /**
         * Iterates over strings items appending its {@link Slot} value. If the 
         * {@link Slot} is an interpolation, the end mark is appended after 
         * {@link Slot} value. If the value is an array, it joins each string 
         * representation.
         */
        const last: number = this.strings.length - 1;
        for (let i = 0; i < last; i++) {
            let { value } = this.slots[i];
            if (Array.isArray(value)) value = value.join("");
            htmlDef += this.strings[i] + value;

            if (!this.slots[i].isAttr) htmlDef += markGenerator();
        }
        
        /**
         * Returns the result of the iterations, appending to it the last 
         * string part.
         */
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
    public toString(): string { return this.html; }

    /**
     * match function test the current {@link Template.regexp} against the 
     * {@link HTMLElement.outerHTML} representation of the HTMLElement
     * provided as argument.
     * @param {Node | HTMLElement} node The target of the test.
     * @returns {boolean} - The result of the test, returns `true` if the 
     * HTMLElement matches.
     */
    public match(node: Node | HTMLElement): boolean {
        const def = (node as HTMLElement).outerHTML;
        return this.regexp.test(def);
    }
    
    /**
     * prepare functions detect the {@link Slot}'s in the current template, its 
     * type between interpolation and attribute, and the slot index. Iterates 
     * over the template strings composing each slot.
     * @param {Array} values - The current values of the {@link Slot}'s
     */
    private prepare(values: Array<any>) {
        /**
         * Creates a variable to store the current {@link Slot} index and 
         * iterates over {@link Template} strings identifying the current 
         * {@link Slot} and parse it. The length of the strings array must be
         * stored too because the number of strings could change.
         */
        let slotIndex: number = 0;
        let length: number = this.strings.length - 1;
        for (let i = 0; i < length; i++) {
            const part: string = this.strings[i];
            let value: any = values[i];

            /**
             * When {@link Slot} value its a function, removes de function body 
             * and keeps the function name as reference. If the function is 
             * inlined, raise an {@link InlineFnErr}.
             */
            if (typeof value === "function") {
                const name = (value as Function).name;
                if (name === "") throw InlineFnErr({ part, value });
                value = `${name}()`;
            }

            /**
             * Checks if the current string is an attribute and gets its name 
             * and prefix using a {@link startAttrParser}.
             */
            const result: Array<string> = startAttrParser(part);
            if (result !== null) {
                /**
                 * If it is an attribute, identifies the initial position of the
                 * opening Node character to mark the element. If it's
                 * the first attribute slot of the Node, updates the 
                 * current {@link Slot} index to the new one.
                 */
                const pos: number = part.lastIndexOf(openHint);
                if (pos !== -1) slotIndex++;

                /**
                 * If the opening character is in the first position of the 
                 * string, updates the string with the mark and its index. If
                 * not, insert the mark between the parts of the string splited
                 * by the initial character.
                 */
                if (pos === 0) {
                    this.strings[i] = markGenerator(slotIndex) + part; 
                } else if (pos > 0) {
                    const start: string = part.substring(0, pos - 1);
                    const end: string = part.substring(pos);
                    this.strings[i] = start + markGenerator(slotIndex) + end;
                }

                /**
                 * Gets the attribute name to store into a {@link Slot} and 
                 * gets prefix value of the attribute.
                 */
                const [ attr, prefix ] = result;
                if (prefix !== "") {
                    const prefixPos: number = this.strings[i].length - prefix.length;
                    this.strings[i] = this.strings[i].slice(0, prefixPos);
                }
                
                /**
                 * Gets the following parts that belong to the same slot 
                 * attribute. Gets the next part and checks if contains the end 
                 * of the attribute definition. While it does not contain the 
                 * end, iterates over the following parts to find it. To parses
                 * the end mark it uses {@link endAttrParser} function.
                 */
                let following: string = "";
                let next: string = this.strings[i + 1];
                let suffix: string = endAttrParser(next);
                while (suffix === null) {
                    /**
                     * In every iteration, stores the followings values and 
                     * parts to append it to the slot.
                     */
                    following += next + values[i + 1];
                    
                    /**
                     * Updates the strings and values list deleting the 
                     * following items and updates the loop limit.
                     */
                    this.strings.splice(i + 1, 1);
                    values.splice(i + 1, 1);
                    length--;

                    /** Updates the next part and does the check again. */
                    next = this.strings[i + 1];
                    suffix = endAttrParser(next);
                }

                /**
                 * Once the end of the attribute is found, it gets the suffix 
                 * substring part of the next one and updates it.
                 */
                this.strings[i + 1] = next.slice(suffix.length);

                /**
                 * Stores the {@link Slot} composing its value withe the current 
                 * value, its prefix, the following components of the attribute
                 * and its suffix.
                 */
                const slotValue = prefix + value + following + suffix;
                this.slots.push(new Slot(slotIndex, slotValue, attr));
            } else {
                /**
                 * If it is an interpoltation, the string is updated with the
                 * mark and its index, the {@link Slot} index is updated and the 
                 * {@link Slot} is stored.
                 */
                slotIndex++;
                this.strings[i] = part + markGenerator(slotIndex);
                this.slots.push(new Slot(slotIndex, value));
            }
        }
    }
}

export { Template };
