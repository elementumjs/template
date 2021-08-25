'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * openHint the initial character of a {@link Node.ELEMENT_NODE} string
 * representation. It allows to find the correct position into a string part for
 * a start {@link Slot} mark.
 */
var openHint = "<";
/**
 * endHint string contains the {@link Node.nodeValue} of the comment nodes
 * that mark the end of a {@link Slot}.
 */
var endHint = "-";
/**
 * markGenerator function returns a {@link Node.COMMENT_NODE} string definition
 * with the slot mark content as value.
 * @param {*} hint - Content to place into the mark. By default
 * {@link endHint}.
 */
var markGenerator = function (hint) {
    if (hint === void 0) { hint = endHint; }
    return "<!--" + hint + "-->";
};
/**
 * escapePart return an escaped version of the provided string to use it into a
 * {@link RegExp} definition without special characters errors.
 * @param {string} part The string part to escape.
 * @returns {string} - The escaped part string.
 */
var escapePart = function (part) {
    return part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
/**
 * attrPrefixRgx contains a {@link RegExp} to detect attributes and get name and
 * it prefix from a string. Ex.: From `<div foo="bar ` gets `foo` & `bar `.
 */
var attrPrefixRgx = /\s(\S+)\=[\"\']([^\"]*)$/;
/**
 * startAttrParser function parses a part string like the start of an HTML
 * attribute string representation. If the provided part is not an attribute,
 * it returns `null`. Else, returns a the name of the attribute and the prefix
 * part from its content.
 * @param {string} part The part to parse.
 * @returns {Array<string>} - The result of the parse process.
 */
var startAttrParser = function (part) {
    var result = attrPrefixRgx.exec(part);
    return result !== null ? [result[1], result[2]] : null;
};
/**
 * Regex expressions to catchs the {@link Slot} attribute suffix.
 * Ex.: From ` bar" foo2="bar2">` gets ` bar`.
 */
var attrSufixRgx = /^([^\"]*)[\"|\'][\s|\>]/;
/**
 * endAttrParser function parses a part string like the end of an HTML attribute
 * representation. If the provided part is not an attribute, it returns `null`.
 * Else, returns the attribute content suffix.
 * @param {string} part The part to parse.
 * @returns {string} - The result of the parse process.
 */
var endAttrParser = function (part) {
    var result = attrSufixRgx.exec(part);
    return result !== null ? result[1] : null;
};

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

/** ERROR_MESSAGES contains the list of human readables error messages. */
var ERROR_MESSAGES = {
    1: "injected functions cannot be inlined. Please define the function outside and reference it by its name. Ex.: <button onclick='${fn}'>",
    2: "the requested slot is not found",
    3: "to render a template into a list, every list items must be a Template instance."
};
/**
 * TemplateError extends {@link Error} to provide custom errors to the library.
 * It allows to manage the error message easely.
 * @class TemplateError
 * @extends {Error}
 */
var TemplateError = /** @class */ (function (_super) {
    __extends(TemplateError, _super);
    /**
     * constructor method fill the class attributes of a {@link TemplateError}.
     * @param {string} message Human readable error message to throw.
     * @param {number} code The error code of the error message.
     * @param {any} metadata The error metadata to append to the error as extra
     * data to debug it.
     */
    function TemplateError(message, code, metadata) {
        if (code === void 0) { code = -1; }
        var _this = _super.call(this, message) || this;
        _this.name = "TemplateError";
        _this.message = message;
        _this.code = code;
        _this.metadata = metadata;
        return _this;
    }
    /**
     * generate function a error by its code. Gets the error message from
     * {@link ERROR_MESSAGES}.
     * @param {number} code The numeric identifier of the error.
     * @param {any=} metadata Extra data to append to the error to debug it.
     * @returns {TemplateError} - The generated error.
     */
    TemplateError.generate = function (code, metadata) {
        var message = ERROR_MESSAGES[code];
        return new TemplateError(message, code, metadata);
    };
    TemplateError.INLINE_FUNCTION = 1;
    TemplateError.SLOT_NOT_FOUND = 2;
    TemplateError.NOT_TEMPLATE_VALUE = 3;
    return TemplateError;
}(Error));
/**
 * InlineFunctionError function creates a {@link TemplateError} using the error
 * code {@link TemplateError.INLINE_FUNCTION}.
 * @param metadata Extra data to append to the error to debug it.
 * @returns {TemplateError} - The generated error.
 */
var InlineFunctionError = function (metadata) {
    return TemplateError.generate(TemplateError.INLINE_FUNCTION, metadata);
};
/**
 * SlotNotFoundError function creates a {@link TemplateError} using the error
 * code {@link TemplateError.SLOT_NOT_FOUND}.
 * @param metadata Extra data to append to the error to debug it.
 * @returns {TemplateError} - The generated error.
 */
var SlotNotFoundError = function (metadata) {
    return TemplateError.generate(TemplateError.SLOT_NOT_FOUND, metadata);
};
/**
 * IsNotTemplateError function creates a {@link TemplateError} using the error
 * code {@link TemplateError.NOT_TEMPLATE_VALUE}.
 * @param metadata Extra data to append to the error to debug it.
 * @returns {TemplateError} - The generated error.
 */
var IsNotTemplateError = function (metadata) {
    return TemplateError.generate(TemplateError.NOT_TEMPLATE_VALUE, metadata);
};

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
     * getSlot method iterates over the current template definition slots
     * searching for a slot with the same index that the provided one.
     * @param {number} slotIndex The index of the slot to search.
     * @returns {Slot} - The desired slot.
     */
    Processor.prototype.getSlot = function (index) {
        // Iterates over the template slots to get the correct one by provided
        // index.
        var length = this.template.slots.length;
        for (var i = 0; i < length; i++) {
            // Search for the slot with the current index.
            var slot = this.template.slots[i];
            if (slot.slotIndex === index)
                return slot;
        }
        throw SlotNotFoundError({
            template: this.template,
            slot: index
        });
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
                var slot = this.getSlot(slotIndex);
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
        /**
         *
         */
        get: function () {
            return this.attr !== null && this.attr !== undefined;
        },
        enumerable: false,
        configurable: true
    });
    /**
     *
     * @param startMark
     */
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
                    endMark.nodeValue !== endHint) {
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
    /**
     *
     * @param node
     */
    Slot.prototype.commitAttr = function (node) {
        var attr = this.attr;
        var value = Array.isArray(this.value) ?
            this.value.join(" ") : this.value;
        var current = node.getAttribute(attr);
        if (current !== value)
            node.setAttribute(attr, value);
    };
    /**
     *
     */
    Slot.prototype.commitValue = function (node, startMark, value) {
        if (node === undefined || node === null) {
            startMark.parentNode.insertBefore(document.createTextNode(value), startMark.nextSibling);
        }
        else if (node.nodeValue !== value)
            node.nodeValue = value;
    };
    /**
     *
     * @param node
     * @param startMark
     * @param template
     */
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
    /**
     *
     * @param nodes
     * @param startMark
     * @param endMark
     * @param templates
     */
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
                if (template.constructor.name !== "Template")
                    throw IsNotTemplateError({ node: node, template: template });
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
    Object.defineProperty(Template.prototype, "regexp", {
        /**
         * regexp getter function returns a composed {@link RegExp} of the current
         * element to check if any {@link HTMLElement} match with the current
         * {@link Template} and its {@link Slot} areas.
         * @returns {RegExp} - The composed {@link RegExp} of the current template.
         */
        get: function () {
            /**
             * Creates a variable to store the html string definition and append the
             * formated part in each iteration.
             */
            var htmlDef = "";
            /**
             * Iterates over strings items appending its parts escaped and a pattern
             * to detect {@link Slot} areas. Closing {@link Slot} interpolations
             * with a end mark using ({@link markGenerator}).
             */
            var last = this.strings.length - 1;
            for (var i = 0; i < last; i++) {
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
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Template.prototype, "html", {
        /**
         * html function returns the string definition of the template, including
         * the slots marks (attributes and interpolation marks) and the value of
         * the slots injected.
         * @returns {string} The composed html string definition.
         */
        get: function () {
            /**
             * Creates a variable to store the html string definition and append the
             * formated part in each iteration.
             */
            var htmlDef = "";
            /**
             * Iterates over strings items appending its {@link Slot} value. If the
             * {@link Slot} is an interpolation, the end mark is appended after
             * {@link Slot} value. If the value is an array, it joins each string
             * representation.
             */
            var last = this.strings.length - 1;
            for (var i = 0; i < last; i++) {
                var value = this.slots[i].value;
                if (Array.isArray(value))
                    value = value.join("");
                htmlDef += this.strings[i] + value;
                if (!this.slots[i].isAttr)
                    htmlDef += markGenerator();
            }
            /**
             * Returns the result of the iterations, appending to it the last
             * string part.
             */
            return htmlDef + this.strings[last];
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
     * match function test the current {@link Template.regexp} against the
     * {@link HTMLElement.outerHTML} representation of the {@link HTMLElement}
     * provided as argument.
     * @param {Node | HTMLElement} node The target of the test.
     * @returns {boolean} - The result of the test, returns `true` if the
     * {@link HTMLElement} matches.
     */
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
        /**
         * Creates a variable to store the current {@link Slot} index and
         * iterates over {@link Template} strings identifying the current
         * {@link Slot} and parse it. The length of the strings array must be
         * stored too because the number of strings could change.
         */
        var slotIndex = 0;
        var length = this.strings.length - 1;
        for (var i = 0; i < length; i++) {
            var part = this.strings[i];
            var value = values[i];
            /**
             * When {@link Slot} value its a function, removes de function body
             * and keeps the function name as reference. If the function is
             * inlined, raise an {@link InlineFunctionError}.
             */
            if (typeof value === "function") {
                var name_1 = value.name;
                if (name_1 === "")
                    throw InlineFunctionError({ part: part, value: value });
                value = name_1 + "()";
            }
            /**
             * Checks if the current string is an attribute and gets its name
             * and prefix using a {@link startAttrParser}.
             */
            var result = startAttrParser(part);
            if (result !== null) {
                /**
                 * If it is an attribute, identifies the initial position of the
                 * opening {@link Node} character to mark the element. If it's
                 * the first attribute slot of the {@link Node}, updates the
                 * current slot index to the new one.
                 */
                var pos = part.lastIndexOf(openHint);
                if (pos != -1)
                    slotIndex++;
                /**
                 * If the opening character is in the first position of the
                 * string, updates the string with the mark and its index. If
                 * not, insert the mark between the parts of the string splited
                 * by the initial character.
                 */
                if (pos === 0) {
                    this.strings[i] = markGenerator(slotIndex) + part;
                }
                else if (pos > 0) {
                    var start = part.substring(0, pos - 1);
                    var end = part.substring(pos);
                    this.strings[i] = start + markGenerator(slotIndex) + end;
                }
                /**
                 * Gets the attribute name to store into a {@link Slot} and
                 * gets prefix value of the attribute.
                 */
                var attr = result[0], prefix = result[1];
                if (prefix !== "") {
                    var prefixPos = this.strings[i].length - prefix.length;
                    this.strings[i] = this.strings[i].slice(0, prefixPos);
                }
                /**
                 * Gets the following parts that belong to the same slot
                 * attribute. Gets the next part and checks if contains the end
                 * of the attribute definition. While it does not contain the
                 * end, iterates over the following parts to find it. To parses
                 * the end mark it uses {@link endAttrParser} function.
                 */
                var following = "";
                var next = this.strings[i + 1];
                var suffix = endAttrParser(next);
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
                 * Stores the slot composing its value withe the current value,
                 * its prefix, the following components of the attribute and its
                 * suffix.
                 */
                var slotValue = prefix + value + following + suffix;
                this.slots.push(new Slot(slotIndex, slotValue, attr));
            }
            else {
                /**
                 * If it is an interpoltation, the string is updated with the
                 * mark and its index, the slot index is updated and the slot
                 * is stored.
                 */
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
