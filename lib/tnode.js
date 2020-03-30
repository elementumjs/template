import Path from './path';

/**
 * TNodeField object abstracts a fillable slot of a TNode.
 * @typedef {Object} TNodeField
 * @property {string=} attr - The attribute name, if field is for an 
 * attribute.
 * @property {Node=} nextElem - The following {@link Node} of the fillable 
 * interpolation
 * @property {*} value - The value of the field.
 */

/**
 * TNodeType constant defines the range of types that a TNode can be.
 */
const TNodeType = {
    ATTRIBUTE: "attr",
    INTERPOLATION: "interpolation",
    EMPTY: "empty"
};

/**
 * _attrRe defines the regexp to detect and parse attributes.
 * @private
 */
const _attrRe = /\s(\S+)\=[\"\']<!--slot\(([0-9]+)\)-->[\"\']/gm;

/**
 * _interRe defines the regexp to detect and parse interpolations.
 * @private
 */
const _interRe = /slot\(([0-9]+)\)/gm;

/**
 * _protectedAttrs contains a set of {@link Node} attributes that are protected
 * and can not be changed.
 * @private
 */
const _protectedAttrs = [ "id" ];

/**
 * TNode class makes a {@link Node} ready to perform updates reactivly.
 * @class TNode
 */
class TNode {
    /**
     * Creates a {@link TNode} based on the {@link Node} provided as argument.
     * It gets the {@link Path} and the plain HTML content of the source node,
     * checks its type and inits the parsing process. Also creates some empty
     * variables to store internal stuff.
     * @param {Node} node 
     */
    constructor(node) {
        if (!node || node.nodeType === undefined) {
            throw new TypeError("argument provided is not a Node", "tnode.js");
        }

        this.path = Path.fromNode(node);
        this.fields = new Map();
        
        this._node = node;
        this._outer = this._node.outerHTML;
        this._type = this._getType();

        this._initParsing();
    }

    /**
     * TNode.hasTNodeFields returns if the current TNode has any {@link TNodeField} 
     * to fill with TValues.
     * @type {boolean}
     */
    get hasTNodeFields() {
        return this._type != TNodeType.EMPTY && this.fields.size !== 0;
    }

    /**
     * TNode.isAttr returns if the current TNode is a fillable attribute with
     * TValue.
     * @type {boolean}
     */
    get isAttr() {
        return this._type == TNodeType.ATTRIBUTE;
    }

    /**
     * TNode.isAttr returns if the current TNode is a fillable HTML 
     * interpolation with TValue.
     * @type {boolean}
     */
    get isInterpolation() {
        return this._type == TNodeType.INTERPOLATION;
    }

    /**
     * TNode._getType returns the type of the current {@link TNode} between 
     * {@link TNodeType} according to the {@link Node.nodeType} of the current
     * instance {@link Node}.
     * @private
     */
    _getType() {
        let type = TNodeType.EMPTY;
        if (this._node.nodeType === Document.COMMENT_NODE) {
            if (_interRe.test(this._node.data)) type = TNodeType.INTERPOLATION;
            _interRe.lastIndex = 0;
        } else if (this._node.nodeType === Document.ELEMENT_NODE) {
            if (_attrRe.test(this._outer)) type = TNodeType.ATTRIBUTE;
            _attrRe.lastIndex = 0;
        }

        return type;
    }

    /**
     * TNode._initParsing starts the parsing process in base to the 
     * {@link TNode._type}. If the current {@link TNode} is an attribute call 
     * {@link TNode._parseAttr}, else calls {@link TNode._parseInter} if is an 
     * interpolation.
     * @private
     */
    _initParsing() {
        if (this.isAttr) this._parseAttr();
        else if (this.isInterpolation) this._parseInter();
    }

    /**
     * TNode._parseAttr parses all the fillable attributes of the current 
     * {@link Node}. It extracts all of this attributes using regexp and 
     * composes a {@link TNodeField}, then it stores each one into a 
     * {@link Map}.
     * @private
     */
    _parseAttr() {
        let res = Array.from(this._outer.matchAll(_attrRe));
        _attrRe.lastIndex = 0;

        res.forEach(group => {
            let attr = group[1];
            let index = parseInt(group[2]);
            if (_protectedAttrs.includes(attr)) {
                throw new Error(`Node attribute '${ attr }' can not be dynamic`, "tnode.js");
            }

            this.fields.set(index, { attr, value: null });
        });
    }

    /**
     * TNode._parseAttr parses all the fillable interpolations of the current 
     * {@link Node}. It extracts all of this interpolations using regexp and 
     * composes a field, then it stores each one into a {@link Map}.
     * @private
     */
    _parseInter() {
        let res = Array.from(this._node.data.matchAll(_interRe));
        _interRe.lastIndex = 0;

        res.forEach(group => {
            let index = parseInt(group[1]);
            let nextElem = (!this._node.nextSibling) ? null :
                Path.fromNode(this._node.nextElementSibling);

            this.fields.set(index, { nextElem, value: null});
        });
    }

    /**
     * TNode._renderAttr update the element attributes of a TNode with its 
     * {@link TNodeField}'s.
     * @param {Node} node - The current state of the {@link Node} to be updated.
     * @private
     */
    _renderAttr(node) {
        this.fields.forEach(field => {
            node.setAttribute(field.attr, field.value);
        });
    }

    /**
     * TNode._renderInter update the element interpolation of a TNode with its 
     * {@link TNodeField}'s.
     * @param {Node} node - The current state of the {@link Node} to be updated.
     * @private
     */
    _renderInter(node) {
        let field = Array.from(this.fields.values())[0];
        let temp = document.createElement("div");
        temp.innerHTML = field.value;

        let next = field.nextElem ? Path.findNode(field.nextElem, node.getRootNode()) : null;
        this._clearInter(node, next);
        
        Array.from(temp.childNodes).forEach(child => {
            if (next) node.parentNode.insertBefore(child, next);
            else node.parentNode.insertBefore(child, node.nextSibling);
        });
    }

    /**
     * TNode._clearInter removes all the content of the current {@link TNode} 
     * {@link Node} element before be updated.
     * @param {Node} elem - The current state of the {@link Node} to be cleared.
     * @param {*} nextElem - The last node to delete to.
     * @private
     */
    _clearInter(elem, nextElem) {
        let end = nextElem;
        let next = elem.nextSibling;

        while (next && !next.isEqualNode(end)) {
            let _next = next.nextSibling;
            elem.parentNode.removeChild(next);
            next = _next;
        }
    }

    /**
     * TNode.setFieldValue allows setting the value of the current {@link TNode}.
     * It updates the value of the {@link TNodeField} referenced by the index
     * provided.
     * {@link TNodeField}'s.
     * @param {number} index - The index of the {@link TNodeField} to be set.
     * @param {*} value - The new value of the referenced {@link TNodeField}.
     */
    setFieldValue(index, value) {
        let temp = this.fields.get(index);
        temp.value = value;
        this.fields.set(index, temp);
    }

    /**
     * TNode.render function starts the process of renderization of the current
     * {@link Node}, based on the current {@link TNodeType}.
     * @param {Node} container 
     */
    render(container) {
        if (!container || container.nodeType === undefined) {
            throw new TypeError("container provided is not a Node", "tnode.js");
        }

        let elem = Path.findNode(this.path, container);
        if (this.isAttr) this._renderAttr(elem);
        else if (this.isInterpolation) this._renderInter(elem);
    }
}

export default TNode;