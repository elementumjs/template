/** ERROR_MESSAGES contains the list of human readables error messages. */
const ERROR_MESSAGES = {
    1: "injected functions cannot be inlined. Please define the function outside and reference it by its name. Ex.: <button onclick='${fn}'>",
    2: "the requested slot is not found",
    3: "to render a template into a list, every list items must be a Template instance."
};

/**
 * TemplateError extends {@link Error} to provide custom errors to the library.
 * It allows to manage the error message easely.
 */
class TemplateError extends Error {
    code: number;
    metadata: any;

    static INLINE_FUNCTION: number = 1;
    static SLOT_NOT_FOUND: number = 2;
    static NOT_TEMPLATE_VALUE: number = 3;

    /**
     * constructor method fill the class attributes of a {@link TemplateError}.
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
     * generate function a error by its code. Gets the error message from
     * {@link ERROR_MESSAGES}.
     * @param {number} code The numeric identifier of the error.
     * @param {any=} metadata Extra data to append to the error to debug it.
     * @returns {TemplateError} - The generated error.
     */
    static generate(code: number, metadata?: any): TemplateError {
        const message = ERROR_MESSAGES[code];
        return new TemplateError(message, code, metadata)
    }
}

/**
 * InlineFunctionError function creates a {@link TemplateError} using the error
 * code {@link TemplateError.INLINE_FUNCTION}.
 * @param metadata Extra data to append to the error to debug it.
 * @returns {TemplateError} - The generated error.
 */
export const InlineFunctionError = (metadata?: any): TemplateError => 
    TemplateError.generate(TemplateError.INLINE_FUNCTION, metadata);

/**
 * SlotNotFoundError function creates a {@link TemplateError} using the error
 * code {@link TemplateError.SLOT_NOT_FOUND}.
 * @param metadata Extra data to append to the error to debug it.
 * @returns {TemplateError} - The generated error.
 */
export const SlotNotFoundError = (metadata?: any): TemplateError => 
    TemplateError.generate(TemplateError.SLOT_NOT_FOUND, metadata);

/**
 * IsNotTemplateError function creates a {@link TemplateError} using the error
 * code {@link TemplateError.NOT_TEMPLATE_VALUE}.
 * @param metadata Extra data to append to the error to debug it.
 * @returns {TemplateError} - The generated error.
 */
export const IsNotTemplateError = (metadata?: any): TemplateError => 
    TemplateError.generate(TemplateError.NOT_TEMPLATE_VALUE, metadata);

export { TemplateError };