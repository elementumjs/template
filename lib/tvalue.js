/**
 * _pathDel contains de character to delimiter the reference paths.
 * @private
 */
const _pathDel = ".";

/**
 * TValueType constant defines the range of types that a TValue can be.
 */
const TValueType = {
    RAW: "raw",
    REF: "ref"
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
     * @param {string=} path - The path of value into the source data.
     * @param {*=} value - The raw value of patherenced data.
     */
    constructor(path = null, value = null) {
        if (path !== null && typeof path !== "string") {
            throw new TypeError("The reference must be an string.", "tvalue.js");
        } else if (path === null && value === null) {
            throw new Error("At least one argument must be provided.", "tvalue.js");
        }

        this._path = (path !== null) ? path.split(_pathDel) : null;
        this._value = value;
        this._type = (this._path !== null) ? TValueType.REF : TValueType.RAW;
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
     * TValue.path returns the current reference of {@link TValue} object instanced 
     * parsed as string.
     * @type {string}
     */
    get path() {
        return this._path.join(_pathDel);
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
     * TValue.equalPath returns if the current {@link TValue} has an equal 
     * path that the path provided as an argument. If the current {@link TValue} 
     * is not a reference {@link TValue} rais an Error.
     * @param {(string|string[]} path - The path to compare with.
     * @returns {boolean} If current reference is equal to the provided one.
     */
    equalPath(path) {
        if (!this.isRef) {
            throw new TypeError("Current TValue is not a reference.", "tvalue.js");
        }

        if (Array.isArray(path)) return this.path === path.join(_pathDel);
        else if (typeof path === "string") return this.path === path;

        throw new TypeError("The reference must be a string or an array.", "tvalue.js");
    }

    /**
     * TValue.fromData searches the value referenced by the current {@link TValue}
     * instance reference into the data object provided as an argument.
     * @param {Object} data - The source data object to search for the reference.
     * @returns {*} The value referenced.
     */
    fromData(data) {
        if (!this.isRef) {
            throw new TypeError("The current TValue is not a reference.", "tvalue.js");
        } else if (!data || typeof data !== "object") {
            throw new TypeError("Data provided is null or is not an object.", "tvalue.js");
        } else if (Object.keys(data).length === 0) {
            throw new Error("Data provided is empty.", "tvalue.js");
        }

        let res = data;
        for (let i = 0; i < this._path.length; i++) {
            let prop = this._path[i];
            if (
                !Object.prototype.hasOwnProperty.call(res, prop) ||
                res[prop] === undefined
            ) return;

            res = res[prop];
        }
        return res;        
    }
}

export default TValue;