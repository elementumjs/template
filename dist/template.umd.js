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
     * endMarkNeedle string contains the nodeValue of the comment nodes that mark
     * the end of a slot.
     */
    var endMarkNeedle = "-";
    /**
     * markGenerator function returns a HTML comment string definition with the slot
     * mark content as value.
     * @param {*} needle - Content to place into the mark
     */
    var markGenerator = function (needle) { return "<!--" + needle + "-->"; };
    var escapePart = function (part) { return part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); };
    /**
     * Regex expressions to detect attributes name and its prefix.
     */
    var attributeNameAndPrefixRgx = /\s(\S+)\=[\"\']([^\"]*)$/;
    /**
     * Regex expressions to catchs the slot attribute sufix.
     */
    var attributeSufixRgx = /^([^\"]*)[\"|\'][\s|\>]/;
    /**
     * acceptNode its a function to filter Comment nodes with a number as nodeValue.
     * This kind of Comments represents the start of a template slot.
     * @param {Node} node - Node candidate to filter.
     * @returns {number} Returns if node provided is allowed between
     * {@link NodeFilter.FILTER_ACCEPT} and {@link NodeFilter.FILTER_REJECT}.
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
     * @class Processor
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
         * getSlotByIndex method iterates over the current template definition slots
         * searching for a slot with the same index that the provided one.
         * @param {number} slotIndex The index of the slot to search.
         * @returns {Slot} - The desired slot.
         */
        Processor.prototype.getSlotByIndex = function (slotIndex) {
            // Iterates over the template slots to get the correct one by provided
            // index.
            var length = this.template.slots.length;
            for (var i = 0; i < length; i++) {
                // Search for the slot with the current index.
                var slot = this.template.slots[i];
                if (slot.slotIndex === slotIndex)
                    return slot;
            }
            throw new Error('slot not found');
        };
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
                var slotIndex = parseInt(current.nodeValue);
                // The template slots have consecutive slot indexes, so the next 
                // valid slot must have a higher slot index than the previous one. 
                // If not, the next slot is relative to another child template.
                if (slotIndex > lastSlotIndex) {
                    var slot = this.getSlotByIndex(slotIndex);
                    slot.commit(current);
                    lastSlotIndex = slotIndex;
                }
                current = walker.nextNode();
            }
        };
        return Processor;
    }());

    /**
     * Slot object abstracts a fillable slot of a template.
     */
    var Slot = /** @class */ (function () {
        function Slot(index, value, attr) {
            this.slotIndex = index;
            this.attr = attr;
            this.value = value;
        }
        Object.defineProperty(Slot.prototype, "isAttr", {
            get: function () {
                return this.attr !== null && this.attr !== undefined;
            },
            enumerable: false,
            configurable: true
        });
        Slot.prototype.commit = function (startMark) {
            // If {@link Slot} is not an attribute it will need a node type
            // commit, else it calls to {@link Processor.commitAttr}.
            if (!this.isAttr) {
                // If the {@link Slot} has an array of values it calls to
                // {@lin Processor.renderNodes}, else calls to 
                // {@link Processor.renderNode}.
                var slotValue = this.value;
                if (Array.isArray(slotValue)) {
                    // Gets the referenced slot and its values.
                    // If a {@link Slot} has an array of values, it's 
                    // possible that more than one {@link Node} could be
                    // affected. Iterate over curent {@link Node} siblings
                    // looking for {@link Node.ELEMENT_NODE}.
                    var slotNodes = [];
                    var endMark = startMark.nextSibling;
                    while (endMark.nodeType !== Node.COMMENT_NODE &&
                        endMark.nodeValue !== endMarkNeedle) {
                        slotNodes.push(endMark);
                        endMark = endMark.nextSibling;
                    }
                    this.commitTemplates(slotNodes, startMark, endMark, slotValue);
                }
                else {
                    var node = startMark.nextSibling;
                    if (slotValue.constructor.name === "Template") {
                        this.commitTemplate(node, startMark, slotValue);
                    }
                    else
                        this.commitValue(node, startMark, slotValue);
                }
            }
            else
                this.commitAttr(startMark.nextSibling);
        };
        Slot.prototype.commitAttr = function (node) {
            var attr = this.attr;
            var value = Array.isArray(this.value) ?
                this.value.join(" ") : this.value;
            var current = node.getAttribute(attr);
            if (current !== value)
                node.setAttribute(attr, value);
        };
        Slot.prototype.commitValue = function (node, startMark, value) {
            if (node === undefined || node === null) {
                startMark.parentNode.insertBefore(document.createTextNode(value), startMark.nextSibling);
            }
            else if (node.nodeValue !== value)
                node.nodeValue = value;
        };
        Slot.prototype.commitTemplate = function (node, startMark, template) {
            if (node === undefined) {
                startMark.parentNode.insertBefore(template.element, startMark.nextSibling);
            }
            else if (node.nodeType === Node.COMMENT_NODE) {
                node.parentNode.insertBefore(template.element, node);
            }
            else if (template.match(node)) {
                new Processor(template, node).render();
            }
            else
                node.parentNode.replaceChild(template.element, node);
        };
        Slot.prototype.commitTemplates = function (nodes, startMark, endMark, templates) {
            // Calculate the limit of the iteration that is the highest length 
            // between the nodes list and values list.
            var templatesLength = templates.length, nodesLength = nodes.length, limit = templatesLength > nodesLength ?
                templatesLength : nodesLength;
            // Iterate over values and nodes. 
            for (var i = 0; i < limit; i++) {
                var _a = [nodes[i], templates[i]], node = _a[0], template = _a[1];
                // If the current {@link Node} has not value, remove the 
                // current {@link Node}.
                if (template !== undefined) {
                    // Throws an error if any of slot values is not a Template instance. 
                    if (template.constructor.name !== "Template") {
                        var error = 'to render a template into a list, every list ' +
                            'items must be a Template instance.';
                        throw new Error(error);
                    }
                    this.commitTemplate(node || endMark, startMark, template);
                }
                else if (node !== undefined)
                    node.parentNode.removeChild(node);
            }
        };
        return Slot;
    }());

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
                    var _a = this.slots[i]; _a.attr; var value = _a.value;
                    // If the value is an array, it joins each string representation.
                    if (Array.isArray(value))
                        value = value.join("");
                    htmlDef += this.strings[i] + value;
                    if (!this.slots[i].isAttr)
                        htmlDef += markGenerator("-");
                }
                // Returns the result of the iterations, appending to it the last 
                // string part.
                return htmlDef + this.strings[last];
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Template.prototype, "regexp", {
            get: function () {
                // Creates a variable to store the html string definition and append the
                // formated part in each iteration.
                var htmlDef = "";
                // Iterates over strings items appending its slot value. If the slot is 
                // an interpolation, the end mark is appended after slot value.
                var last = this.strings.length - 1;
                for (var i = 0; i < last; i++) {
                    htmlDef += escapePart(this.strings[i]) + '(.*)';
                    if (!this.slots[i].isAttr)
                        htmlDef += escapePart(markGenerator("-"));
                }
                // Returns the result of the iterations, appending to it the last 
                // string part.
                htmlDef += escapePart(this.strings[last]);
                return new RegExp(htmlDef);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Template.prototype, "element", {
            /**
             * element returns a generated DocumentFragment element with the template
             * html definition inside of it.
             * @returns {DocumentFragment} The generated HTML element.
             */
            get: function () {
                var range = document.createRange();
                return range.createContextualFragment(this.html);
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Returns the composed template definition as string.
         * @returns {string} The composed html string definition.
         */
        Template.prototype.toString = function () { return this.html; };
        Template.prototype.match = function (node) {
            var def = node.outerHTML;
            return this.regexp.test(def);
        };
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
                    var slotValue = prefix + value + following + suffix;
                    this.slots.push(new Slot(slotIndex, slotValue, attr));
                }
                else {
                    // If it is an interpoltation, the string is updated with the
                    // mark and its index, the slot index is updated and the slot 
                    // is stored.
                    slotIndex++;
                    this.strings[i] = part + markGenerator(slotIndex);
                    this.slots.push(new Slot(slotIndex, value));
                }
            }
        };
        return Template;
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
