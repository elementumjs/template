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
    return Slot;
}());
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
                // If the value is an array, it joins each string representation.
                if (Array.isArray(value))
                    value = value.join("");
                htmlDef += this.strings[i] + value;
                // Checks if is an interpolation to append to it the end mark.
                // An end mark is a HTML Comment with a dash as content.
                if (attr === null)
                    htmlDef += markGenerator(endMarkNeedle);
            }
            // Returns the result of the iterations, appending to it the last 
            // string part.
            htmlDef += this.strings[last];
            return htmlDef;
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
                // Gets attribute and value parameter of the slot and append it to 
                // the after the current string.
                var attr = this.slots[i].attr;
                // If the value is an array, it joins each string representation.
                htmlDef += escapePart(this.strings[i]) + '(.*)';
                // Checks if is an interpolation to append to it the end mark.
                // An end mark is a HTML Comment with a dash as content.
                if (attr === null)
                    htmlDef += escapePart(markGenerator(endMarkNeedle));
            }
            // Returns the result of the iterations, appending to it the last 
            // string part.
            htmlDef += escapePart(this.strings[last]);
            //return new RegExp(htmlDef.replace(/\s|\r|\n/gm, ''));
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
        var slot;
        var length = this.template.slots.length;
        for (var i = 0; i < length; i++) {
            // Search for the slot with the current index.
            slot = this.template.slots[i];
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
            var nodeValue = current.nodeValue;
            var slotIndex = parseInt(nodeValue);
            // The template slots have consecutive slot indexes, so the next 
            // valid slot must have a higher slot index than the previous one. 
            // If not, the next slot is relative to another child template.
            if (slotIndex > lastSlotIndex) {
                var slot = this.getSlotByIndex(slotIndex);
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
                        var slotNodes = [];
                        var currentSibling = current.nextSibling;
                        while (currentSibling !== null &&
                            currentSibling.nodeType === Node.ELEMENT_NODE) {
                            slotNodes.push(currentSibling);
                            currentSibling = currentSibling.nextSibling;
                        }
                        // Call {@link Proccesor.commitNodes} passing the 
                        // current {@link Node} as {@link Slot} starter mark.
                        this.commitNodes(slotNodes, current, slot);
                    }
                    else
                        this.commitNode(current.nextSibling, slot);
                }
                else
                    this.commitAttr(current.nextSibling, slot);
                lastSlotIndex = slotIndex;
            }
            current = walker.nextNode();
        }
    };
    /**
     *
     * @param node
     * @param slot
     */
    Processor.prototype.commitAttr = function (node, slot) {
        var attr = slot.attr;
        var value = Array.isArray(slot.value) ? slot.value.join(" ") : slot.value;
        var current = node.getAttribute(attr);
        if (current !== value)
            node.setAttribute(attr, value);
    };
    /**
     * commitNode gets the slot referenced by the index and compares its value
     * with the target node value. If its not equal, the target node will be
     * updated.
     * @param {Node} node - The target node of the slot.
     * @param {Slot} slot - The index of the slot referenced.
     */
    Processor.prototype.commitNode = function (node, slot) {
        // If the value is another {@link Template} and the current html 
        // definition is not equal that the new one, creates a new
        // {@link Processor} with the {@link Template} instance and 
        // the current node as container. 
        // If the slot is an interpolation, compares its value with the
        // slot value, if they are not equal, the target value is 
        // updated with the new one.
        var value = slot.value;
        if (value instanceof Template) {
            // Compare the html defintion of the current node with the new one 
            // before update it.
            var current = node.outerHTML;
            if (!current)
                node.parentNode.insertBefore(value.element, node);
            else if (value.regexp.test(current))
                new Processor(value, node).render();
            else
                node.parentNode.replaceChild(value.element, node);
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
    };
    /**
     * commitNodes gets the slot referenced by the index and compares its values
     * with the targets nodes values. If any of them is not equal, the target
     * node will be updated.
     * @param {Array<Node>} slotNodes The list of the slot nodes.
     * @param {Slot} slot The index of the slot.
     */
    Processor.prototype.commitNodes = function (slotNodes, markNode, slot) {
        // Gets the referenced slot and its values.
        var slotValues = slot.value;
        // Calculate the limit of the iteration that is the highest length 
        // between the nodes list and values list.
        var valuesLength = slotValues.length;
        var nodesLength = slotNodes.length;
        var limit = valuesLength > nodesLength ?
            valuesLength : nodesLength;
        // Iterate over values and nodes. 
        for (var i = 0; i < limit; i++) {
            var _a = [slotNodes[i], slotValues[i]], node = _a[0], value = _a[1];
            // Throws an error if any of slot values is not a Template instance. 
            if (value !== undefined && !(value instanceof Template)) {
                var error = 'to render a template into a list, every list ' +
                    'items must be a Template instance.';
                throw new Error(error);
            }
            // If a iteration step has not a target node it will be a new 
            // element. If a iteration step has not a slot value associated, the
            // target node must be removed. If a iteration step has both args, 
            // the target node and the slot value, the target node is updated.
            if (value === undefined)
                node.parentNode.removeChild(node);
            else if (node === undefined) {
                // Get the last {@link Node} of the slot to get the 
                // {@link Node.parentNode} from it. Then create the value 
                // element into the {@link Node.parentNode} before the 
                // {@link Node.nextSibling} of the last {@link Node}. If the
                // {@link Node.nextSibling} is `undefined`, 
                // {@link Node.insertBefore()} will insert the element at the 
                // end of the parent {@link Node.childNodes}.
                var prevNode = slotNodes[i - 1] || markNode;
                prevNode.parentNode.insertBefore(value.element, prevNode.nextSibling);
            }
            else
                this.commitNode(node, value);
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

export { Template, html, render };
