/**
 * _refDel contains de character to delimiter the reference paths.
 * @private
 */
const _refDel = '.';

/**
 * TValueType constant defines the range of types that a TValue can be.
 */
const TValueType = {
    RAW: 'raw',
    REF: 'ref'
}

/**
 * TValue class abstracts the value reference of data symbol into an HTML 
 * template. It provides simple API to create a reference to a data value into a 
 * string to retrieve the correct value when the template is rendered. It even 
 * allows storing raw values instead of references.
 * @class TValue
 */
class TValue {
    /**
     * Creates a TValue object base on initial parameters provided. It checks if 
     * provided value its a raw value or reference value and prepares itself 
     * based on that information.
     * @param {string=} ref - Reference of value into the source data.
     * @param {*=} value - Raw value of referenced data.
     */
    constructor(ref = null, value = null) {
        if (ref !== null && typeof ref !== 'string') {
            throw new TypeError('Bad reference provided. Reference must be an array.', 'value.js');
        }

        this._ref = (ref !== null) ? ref.split(_refDel) : null;
        this._value = value;
        this._type = (this._ref !== null) ? TValueType.REF : TValueType.RAW;
    }

    /**
     * TValue.value returns the current raw value of {@link TValue} object 
     * intanced.
     * @type {*}
     */
    get value() {
        return this._value;
    }

    /**
     * TValue.ref returns the current reference of {@link TValue} object instanced 
     * parsed as string.
     * @type {string}
     */
    get ref() {
        return this._ref.join(_refDel);
    }

    /**
     * TValue.isRef returns if the current {@link TValue} object instance is a 
     * reference value.
     * @type {boolean}
     */
    get isRef() {
        return this._type === TValueType.REF;
    }

    /**
     * TValue.isRaw returns if the current {@link TValue} object instance is a raw 
     * value.
     * @type {boolean}
     */
    get isRaw() {
        return this._type === TValueType.RAW;
    }

    /**
     * TValue.equalRef returns if the current {@link TValue} has an equal 
     * reference that the reference provided as an argument. If the current 
     * {@link TValue} is not a reference {@link TValue} rais an Error.
     * @param {(string|string[]} ref - Reference to compare with.
     * @returns {boolean} If current reference is equal to the provided one.
     */
    equalRef(ref) {
        if (this.isRaw) {
            throw new Error('Current TValue is not a reference.', 'value.js');
        }

        if (Array.isArray(ref)) return this.ref === ref.join(_refDel);
        else if (typeof ref === 'string') return this.ref === ref;

        throw new TypeError('The reference must be a string or an array.', 'value.js');
    }

    /**
     * TValue.fromData searches the value referenced by the current {@link TValue}
     * instance reference into the data object provided as an argument.
     * @param {Object} data - The source data object to search for the reference.
     * @returns {*} The value referenced.
     */
    fromData(data) {
        if (this._type === TValueType.REF) {
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
        throw new Error('No reference TValue provided.', 'value.js');
    }
}

export default TValue;