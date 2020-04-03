import TNode from "./tnode.js";
import TValue from "./tvalue.js";

/**
 * TSlot object 
 * @typedef {Object} TSlot
 * @property {number} index - desc
 * @property {TNode} tnode - desc
 * @property {TValue} tvalue - desc
 */

/**
 * _slotIndexHint constant contains the hint to fill the {@link TSlot} marks with the its
 * slot index when it is calculated.
 * @private
 */
const _slotIndexHint = 'index';

/**
 * _slotMarkGenerator constant contains a template to create a comment mark into
 * a template.
 * @private
 */
const _slotMarkGenerator = '<!--slot(index)-->';

/**
 * Template class allows to create a reactive template based on a string and 
 * provides a simple API to render and update them.
 * @class Template
 */
class Template {
    /**
     * Creates the {@link Template}, initializes some internal variables and 
     * starts the building process.
     * @param {strings[]} parts 
     * @param {Object|Array} data 
     */
    constructor(parts, data) {
        this._template = document.createElement('template');
        this._parts = [...parts.raw];
        this._children = [];
        this._tnodes = [];
        this._tslots = { refs: [], raw: [] };
        this._data = data.map(value => value instanceof TValue ? value : 
            new TValue(null, value));

        this._buildTemplate();
    }

    /**
     * Template._encodeMark returns a computed string to mark a {@link TSlot} It
     * replaces the {@link _slotIndexHint} with the provided index in 
     * {@link _slotMarkGenerator}.
     * @param {number} index - The index number to fill the mark template.
     * @private
     */
    static _encodeMark(index) {
        return _slotMarkGenerator.replace(_slotIndexHint, index);
    }

    /**
     * Template.tslots contains a {@link TSlot} array with the raw and 
     * referenced ones.
     * @type {TSlot[]}
     */
    get tslots() {
        return [...this._tslots.raw, ...this._tslots.refs];
    }

    /**
     * Template._buildTemplate performs the template building process. It adds
     * marks between the template parts creating comment {@link Node}s and 
     * iterates over them to create {@link TNode}s assingin its slots.
     * @private
     */
    _buildTemplate() {
        this._markTemplate();
        
        this._getTemplateChildren();
        this._getTemplateNodes();
        this._getTemplateSlots();
    }

    /**
     * Template._markTemplate iterates over the the template parts creating a 
     * comment {@link Node}s adding it to a string. Then injects the computed
     * HTML with the comments between the parts into the created template 
     * {@link Node}.
     * @private
     */
    _markTemplate() {
        let temp = "";
        this._parts.forEach((p, i) => {
            let mark = this._data[i] ? Template._encodeMark(i) : "";
            temp += p + mark; 
        });

        this._template.innerHTML = temp;
    }

    /**
     * Template._getTemplateChildren stores all the nested comment {@link Node}s
     * of the computed template {@link Node}.
     * @private
     */
    _getTemplateChildren() {
        let temp = Array.from(this._template.content.querySelectorAll("*"));
        temp.forEach(child => {
            let res = [ child ];
            child.childNodes.forEach(node => {
                if (node.nodeType === Document.COMMENT_NODE) res.push(node);
            });

            this._children.push(...res);
        });
    }

    /**
     * Template._getTemplateNodes transforms the comment {@link Node}s created
     * into a {@link TNode}s and stores them. Also checks that the total number
     * of {@link TNodeField}s is equal to the length of the data provided.
     * @private
     */
    _getTemplateNodes() {
        let dataSlots = 0;
        this._children.forEach(child => {
            let tnode = new TNode(child);
            if (tnode.hasTNodeFields) {
                dataSlots += tnode.fields.size;
                this._tnodes.push(tnode);
            }
        });

        if (this._data.length !== dataSlots) {
            throw new Error("The number of data slots mismatches with the number of data values provided.", "template.js");
        }
    }

    /**
     * Template._getTemplateSlots creates the {@link TSlot}s of the current
     * {@link TNode}s and store them.
     * @private
     */
    _getTemplateSlots() {
        this._tnodes.forEach(tnode => {
            tnode.fields.forEach((_, index) => {
                let tvalue = this._data[index];
                let tslot = { index, tnode, tvalue };

                if (tvalue.isRef) this._tslots.refs.push(tslot);
                else this._tslots.raw.push(tslot);
            });
        });
    }

    /**
     * Template._getSlotValue returns the current value of slot, accoring to the
     * source {@link TNode} type. If is a reference, the value is returned from 
     * the data provided.
     * @param {TSlot} tslot - The {@link TSlot} to get its value.
     * @param {Object} data - The data source to get the value if the 
     * {@link TNode} is a reference.
     * @private
     */
    _getSlotValue(tslot, data) {
        return (tslot.tvalue.isRef) ? tslot.tvalue.fromData(data) : 
            tslot.tvalue.value;
    }

    /**
     * Template.update function iterates over all the {@link TSlot}s and updates
     * those that have the same reference that the provided. Then, all the 
     * {@link TNode}s with an updated {@link TSlot} are rendered again.
     * @param {Node} container - The parent {@link Node} where it will be 
     * updated into.
     * @param {string|string[]} path - The path of the {@link TNode} to update.
     * @param {*} value - The new value.
     */
    update(container, path, value) {
        if (!container || container.nodeType === undefined) {
            throw new TypeError("container provided is not a Node", "template.js");
        }

        let toUpdate = [];
        this._tslots.refs.forEach(tslot => {
            if (tslot.tvalue.equalPath(path)) {
                tslot.tnode.setFieldValue(tslot.index, value);
                if (!toUpdate.includes(tslot.tnode)) toUpdate.push(tslot.tnode);
            }
        });

        toUpdate.forEach(tnode => tnode.render(container));
    }

    /**
     * Template.render function performs the rendered process into the 
     * {@link Node} container provided. It inject the created template and sets
     * the initial {@link TSlot}s values.
     * @param {Node} container - The parent {@link Node} to render the template.
     * @param {Object|Array} data - The data source to fill the template.
     */
    render(container, data) {
        if (!container || container.nodeType === undefined) {
            throw new TypeError("container provided is not a Node", "template.js");
        }

        container.innerHTML += this._template.innerHTML;

        this.tslots.forEach(tslot => {
            let value = this._getSlotValue(tslot, data);
            tslot.tnode.setFieldValue(tslot.index, value);
        });

        this._tnodes.forEach(node => node.render(container));
    }
}

export const html = (strings, ...values) => new Template(strings, values);
export const val = (path) => new TValue(path[0]);