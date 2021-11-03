/** MEESAGES contains the list of human readables error messages. */
const MEESAGES = {
    1: "injected functions cannot be inlined, reference it instead",
    2: "the requested slot is not found",
    3: "every list items must be a Template instance",
    4: "one slot is required at least. To create string-only elements don't use this."
};

/**
 * TemplateError extends Error to provide custom errors to the library.
 * It allows to manage the error message easely.
 * @class TemplateError
 * @extends {Error}
 */
class TemplateError extends Error {
    /** The error code of the error message. */
    code: number;
    /** The error metadata to append to the error as extra data to debug it. */
    metadata: any;

    /**  */
    static INLINE_FN: number = 1;
    /**  */
    static NOT_SLOT: number = 2;
    /**  */
    static NOT_TEMPLATE: number = 3;
    /**  */
    static EMPTY_SLOTS: number = 4;

    /**
     * TemplateError constructor method fill the class attributes of a 
     * {@link TemplateError}.
     * @param {string} message Human readable error message to throw.
     * @param {number} code The error code of the error message.
     * @param {any} metadata The error metadata to append to the error as extra
     * data to debug it.
     */
    constructor(message: string, code: number = -1, metadata?: any) {
        super(message);

        this.name = "TemplateError";
        this.message = message;
        this.code = code;
        this.metadata = metadata;
    }

    /**
     * create function a error by its code. Gets the error message from
     * {@link ERROR_MESSAGES}.
     * @param {number} code The numeric identifier of the error.
     * @param {any=} metadata Extra data to append to the error to debug it.
     * @returns {TemplateError} - The created error.
     */
    static create(code: number, metadata?: any): TemplateError {
        const message = MEESAGES[code];
        return new TemplateError(message, code, metadata)
    }
}

/**
 * InlineFnErr function creates a {@link TemplateError} using the error
 * code {@link TemplateError.INLINE_FN}.
 * @param metadata Extra data to append to the error to debug it.
 * @returns {TemplateError} - The created error.
 */
export const InlineFnErr = (metadata?: any): TemplateError => 
    TemplateError.create(TemplateError.INLINE_FN, metadata);

/**
 * NotSlotErr function creates a {@link TemplateError} using the error
 * code {@link TemplateError.NOT_SLOT}.
 * @param metadata Extra data to append to the error to debug it.
 * @returns {TemplateError} - The created error.
 */
export const NotSlotErr = (metadata?: any): TemplateError => 
    TemplateError.create(TemplateError.NOT_SLOT, metadata);

/**
 * NotTemplateErr function creates a {@link TemplateError} using the error
 * code {@link TemplateError.NOT_TEMPLATE}.
 * @param metadata Extra data to append to the error to debug it.
 * @returns {TemplateError} - The created error.
 */
export const NotTemplateErr = (metadata?: any): TemplateError => 
    TemplateError.create(TemplateError.NOT_TEMPLATE, metadata);

export { TemplateError };