const _refDel = '.';
const ValueType = {
    RAW: 'raw',
    REF: 'ref'
}

/**
 * Value class abstracts the value reference of data symbol into an HTML 
 * template. It provides simple API to create a reference to a data value into a 
 * string to retrieve the correct value when the template is rendered. It even 
 * allows storing raw values instead of references.
 */
class Value {
    /**
     * Creates a Value object base on initial parameters provided. It checks if 
     * provided value its a raw value or reference value and prepares itself 
     * based on that information.
     * @param {string} ref - Reference of value into the source data.
     * @param {*} value - Raw value of referenced data.
     */
    constructor(ref = null, value = null) {
        if (ref !== null && typeof ref !== 'string') 
            throw new TypeError('Bad reference provided. Reference must be an array.', 'value.js');

        this._ref = (ref !== null) ? ref.split(_refDel) : null;
        this._value = value;
        this._type = (this._ref !== null) ? ValueType.REF : ValueType.RAW;
    }

    /**
     * Value.value returns the current raw value of {@link Value} object 
     * intanced.
     * @returns {*} The current computed value.
     */
    get value() {
        return this._value;
    }

    /**
     * Value.ref returns the current reference of {@link Value} object instanced 
     * parsed as string.
     * @returns {string} The current reference.
     */
    get ref() {
        return this._ref.join(_refDel);
    }

    /**
     * Value.isRef returns if the current {@link Value} object instance is a 
     * reference value.
     * @returns {boolean} If the current instance is a reference value.
     */
    get isRef() {
        return this._type === ValueType.REF;
    }

    /**
     * Value.isRaw returns if the current {@link Value} object instance is a raw 
     * value.
     * @returns {boolean} If the current instance is a raw value.
     */
    get isRaw() {
        return this._type === ValueType.RAW;
    }

    /**
     * Value.equalRef returns if the current {@link Value} has an equal 
     * reference that the reference provided as an argument. If the current 
     * {@link Value} is not a reference {@link Value} rais an Error.
     * @param {(string|string[]} ref - Reference to compare with.
     * @returns {boolean} If current reference is equal to the provided one.
     */
    equalRef(ref) {
        if (this.isRaw) throw new Error('Current Value is not a reference.', 'value.js');

        if (Array.isArray(ref)) return this.ref === ref.join(_refDel);
        else if (typeof ref === 'string') return this.ref === ref;
        throw new TypeError('Bad reference provided. Reference must be a string or an array.', 'value.js');
    }

    /**
     * Value.fromData searches the value referenced by the current {@link Value}
     * instance reference into the data object provided as an argument.
     * @param {Object} data - The source data object to search for the reference.
     * @returns {*} The value referenced.
     */
    fromData(data) {
        if (this._type === ValueType.REF) {
            let res = data;
            for (let i = 0; i < this._ref.length; i++) {
                let prop = this._ref[i];
                if (
                    !Object.prototype.hasOwnProperty.call(res, prop) ||
                    res[prop] === undefined
                ) return;

                res = res[prop];
            }
            return res;
        }
        throw new Error('No reference Value provided.', 'value.js');
    }
}

export default Value;