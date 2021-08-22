(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Template = {}));
}(this, (function (exports) { 'use strict';

    /**
     * openingHint string contains and empty Comment representation.
     */
    var openingHint = "<";
    /**
     * markGenerator function returns a HTML comment string definition with the slot
     * mark content as value.
     * @param {*} needle - Content to place into the mark
     */
    var markGenerator = function (needle) { return "<!--" + needle + "-->"; };
    /**
     * Regex expressions to detect attributes name and its prefix.
     */
    var attributeNameAndPrefixRgx = /\s(\S+)\=[\"\']([^\"]*)$/;
    /**
     * Regex expressions to catchs the slot attribute sufix.
     */
    var attributeSufixRgx = /^([^\"]*)[\"|\'][\s|\>]/;
    /**
     * Template class abstracts the current template strings, args and slots.
     * @class Template
     */
    var Template = /** @class */ (function () {
        /**
         * Creates the {@link Template}, initializes some internal variables and
         * starts the building process.
         * @param {string[]} strings - The literal string tag strings
         * @param {Object|Array} values - The literal string tag args
         */
        function Template(strings, values) {
            if (values === void 0) { values = []; }
            this.strings = strings;
            this.slots = [];
            this.prepare(values);
        }
        Object.defineProperty(Template.prototype, "html", {
            /**
             * html function returns the string definition of the template, including
             * the slots marks (attributes and interpolation marks) and the value of
             * the slots injected.
             * @returns {string} The composed html string definition.
             */
            get: function () {
                // Creates a variable to store the html string definition and append the
                // formated part in each iteration.
                var htmlDef = "";
                // Iterates over strings items appending its slot value. If the slot is 
                // an interpolation, the end mark is appended after slot value.
                var last = this.strings.length - 1;
                for (var i = 0; i < last; i++) {
                    // Gets attribute and value parameter of the slot and append it to 
                    // the after the current string.
                    var _a = this.slots[i], attr = _a.attr, value = _a.value;
                    if (Array.isArray(value))
                        value = value.join('');
                    htmlDef += this.strings[i] + value;
                    // Checks if is an interpolation to append to it the end mark.
                    // An end mark is a HTML Comment with a dash as content.
                    if (attr === null)
                        htmlDef += markGenerator("-");
                }
                // Returns the result of the iterations, appending to it the last 
                // string part.
                return htmlDef + this.strings[last];
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Template.prototype, "element", {
            get: function () {
                var range = document.createRange();
                return range.createContextualFragment(this.html);
            },
            enumerable: false,
            configurable: true
        });
        Template.prototype.toString = function () { return this.html; };
        /**
         * prepare functions detect the slots in the current template, its type
         * between interpolation and attribute, and the slot index. Iterates over
         * the template strings composing each slot.
         * @param {Array} values - The current values of the slots
         */
        Template.prototype.prepare = function (values) {
            // Creates a variable to store the current slot index and iterates over
            // template strings identifying the current slot and parse it.
            var slotIndex = 0;
            var length = this.strings.length - 1;
            for (var i = 0; i < length; i++) {
                // Gets the current string and value to create the slot.
                var part = this.strings[i];
                var value = values[i];
                // When slot value its a function, removes de function body and 
                // keeps the function name as reference.
                if (typeof value === 'function') {
                    var name_1 = value.name;
                    if (name_1 === '') {
                        var error = 'injected functions cannot be inlined.' +
                            'Please define the function outside and reference it ' +
                            'by its name. Ex.: <button onclick="${fn}">';
                        throw new Error(error);
                    }
                    value = name_1 + "()";
                }
                // Checks if the current string is an attribute using a {@link Regex}.
                var result = attributeNameAndPrefixRgx.exec(part);
                if (result !== null) {
                    // If it is an attribute, identifies the initial position of the
                    // opening {@link Node} character to mark the element. If it's
                    // the first attribute slot of the {@link Node}, updates the 
                    // current slot index to the new one.
                    var pos = part.lastIndexOf(openingHint);
                    if (pos != -1)
                        slotIndex++;
                    // If the opening character is in the first position of the 
                    // string, updates the string with the mark and its index. If
                    // not, insert the mark between the parts of the string splited
                    // by the initial character.
                    if (pos === 0) {
                        this.strings[i] = markGenerator(slotIndex) + part;
                    }
                    else if (pos > 0) {
                        var start = part.substring(0, pos - 1);
                        var end = part.substring(pos);
                        this.strings[i] = start + markGenerator(slotIndex) + end;
                    }
                    // Gets the attribute name and store the slot.
                    var attr = result[1];
                    // Get prefix value of slot attribute.
                    var prefix = result[2];
                    var prefixPos = this.strings[i].length - prefix.length;
                    this.strings[i] = this.strings[i].slice(0, prefixPos);
                    // Gets the following parts that belong to the same slot 
                    // attribute. Gets the next part and checks if contains the end 
                    // of the attribute definition. While it does not contain the 
                    // end, iterates over the following parts to find it.
                    var following = "";
                    var next = this.strings[i + 1];
                    var endOfAttribute = attributeSufixRgx.exec(next);
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
                    var suffix = endOfAttribute[1];
                    this.strings[i + 1] = next.slice(suffix.length);
                    // Stores the slot composing its value withe the current value,
                    // its prefix, the following components of the attribute and its
                    // suffix.
                    this.slots.push({
                        slotIndex: slotIndex,
                        attr: attr,
                        value: prefix + value + following + suffix
                    });
                }
                else {
                    // If it is an interpoltation, the string is updated with the
                    // mark and its index, the slot index is updated and the slot 
                    // is stored.
                    slotIndex++;
                    this.strings[i] = part + markGenerator(slotIndex);
                    this.slots.push({ slotIndex: slotIndex, attr: null, value: value });
                }
            }
        };
        return Template;
    }());

    /**
     * acceptNode its a function to filter Comment nodes with a number as nodeValue.
     * This kind of Comments represents the template slot marks.
     * @param {Node} node - Node candidate to filter.
     * @returns {boolean} Returns if node provided is allowed.
     */
    var acceptNode = function (node) {
        var nodeType = node.nodeType, nodeValue = node.nodeValue;
        return nodeType === Node.COMMENT_NODE && !!parseInt(nodeValue) ?
            NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    };
    /**
     * Processor class interprets a template, renders, and updates its slots into a
     * provided container. It checks if the template has not rendered yet into the
     * container and inject it into the container. If it is already rendered,
     * iterates over its slots and checks if they have changed to update them.
     */
    var Processor = /** @class */ (function () {
        /**
         * Processor constructor receives the template to process and the container
         * where it will be rendered.
         * {@link HTMLElement}.
         * @param {Template} template - The template to process.
         * @param {HTMLElement} container - The container to render the template.
         */
        function Processor(template, container) {
            this.template = template;
            this.container = container;
        }
        /**
         * render checks if the template is already rendered into the container
         * after injecting it. If it was rendered, it iterates over template slots
         * to render them. If it was not rendered, it appends the template to the
         * container.
         */
        Processor.prototype.render = function () {
            // Creates a {@link TreeWalker} to iterates over container child nodes.
            // It uses acceptFilter to get the slot marks ({@link Comment} elements 
            // that includes an index).
            var walker = document.createNodeIterator(this.container, NodeFilter.SHOW_COMMENT, { acceptNode: acceptNode });
            // Gets the first mark founded to check if the container has the 
            // template already rendered.
            var current = walker.nextNode();
            if (current === null) {
                // If the first mark founded is null, the template was not detected 
                // and it is appended to the container.
                this.container.appendChild(this.template.element);
                return;
            }
            var lastSlotIndex = 0;
            while (current) {
                // Iterate over the found marks getting their slot index and 
                // committing the current node (the sibling of the {@link Node}
                // mark).
                var nodeValue = current.nodeValue;
                var slotIndex = parseInt(nodeValue);
                // Prevent enter into child Templates definitions.
                if (slotIndex > lastSlotIndex) {
                    // Search for all the slot nodes iterating over siblings until
                    // catch a end mark comment node.
                    var currentSibling = current.nextSibling;
                    var slotNodes = [];
                    while (currentSibling.nodeType !== Node.COMMENT_NODE &&
                        currentSibling.nodeValue !== '-') {
                        slotNodes.push(currentSibling);
                        currentSibling = currentSibling.nextSibling;
                    }
                    if (slotNodes.length > 1)
                        this.commitNodes(slotNodes, slotIndex);
                    else
                        this.commitNode(current.nextSibling, slotIndex);
                    lastSlotIndex = slotIndex;
                }
                current = walker.nextNode();
            }
        };
        /**
         * commitNode gets the slot referenced by the index and compares its value
         * with the target node value. If its not equal, the target node will be
         * updated.
         * @param {Node} node - The target node of the slot.
         * @param {number} slotIndex - The index of the slot referenced.
         */
        Processor.prototype.commitNode = function (node, slotIndex) {
            // Iterates over the template slots to get the correct one by slotIndex
            // provided.
            var length = this.template.slots.length;
            for (var i = 0; i < length; i++) {
                // Checks if current slot has the same slotIndex that the provided.
                var slot = this.template.slots[i];
                if (slot.slotIndex === slotIndex) {
                    // If a slot is found, gets the current attr and value slot
                    // parameters.
                    var attr = slot.attr, value = slot.value;
                    // If the slot attr parameter is not undefined, the slot is an 
                    // attr. It gets the current attribute value to compare with the
                    // slot value, if its not equal, the node attribute is updated.
                    // If the slot is an interpolation, compares its value with the
                    // slot value, if they are not equal, the target value is 
                    // updated with the new one.
                    if (Array.isArray(value))
                        this.commitNodes([node], slotIndex);
                    else if (value instanceof Template) {
                        var current = node.outerHTML;
                        if (current !== value.html)
                            new Processor(value, node).render();
                    }
                    else if (attr !== null) {
                        var current = node.getAttribute(attr);
                        if (current !== value)
                            node.setAttribute(attr, value);
                    }
                    else if (node.nodeValue !== value) {
                        // If the initial slot value is empty no text node is 
                        // created, and the provided node as target is the end 
                        // commment mark, so initalizes the target text node with 
                        // the value and insert before the end comment mark.
                        if (node.nodeType !== Node.COMMENT_NODE)
                            node.nodeValue = value;
                        else
                            node.parentNode.insertBefore(document.createTextNode(value), node);
                    }
                    break;
                }
            }
        };
        Processor.prototype.commitNodes = function (slotNodes, slotIndex) {
            // Iterates over the template slots to get the correct one by slotIndex
            // provided.
            var slot;
            var length = this.template.slots.length;
            for (var i = 0; i < length; i++) {
                // Checks if current slot has the same slotIndex that the provided.
                slot = this.template.slots[i];
                if (slot.slotIndex === slotIndex)
                    break;
            }
            var slotValues = slot.value;
            var valuesLength = slotValues.length;
            var nodesLength = slotNodes.length;
            var limit = valuesLength > nodesLength ?
                valuesLength : nodesLength;
            for (var i = 0; i < limit; i++) {
                var _a = [slotNodes[i], slotValues[i]], node = _a[0], value = _a[1];
                // if (!(value instanceof Template)) throw new Error('to render a template into a list, every list items must be a Template instance.');
                if (node === undefined) {
                    var prevNode = slotNodes[i - 1];
                    prevNode.parentNode.insertBefore(value.element, prevNode.nextSibling);
                }
                else if (value === undefined) {
                    node.parentNode.removeChild(node);
                }
                else {
                    var current = node.outerHTML;
                    if (current !== value.html)
                        new Processor(value, node).render();
                }
            }
        };
        return Processor;
    }());

    var html = function (strings) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return new Template(strings.raw.slice(0), args);
    };
    var render = function (template, container) { return new Processor(template, container).render(); };

    exports.Template = Template;
    exports.html = html;
    exports.render = render;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
