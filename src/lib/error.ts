/**
 * 
 */
const ERROR_MESSAGES = {
    1: "injected functions cannot be inlined. Please define the function outside and reference it by its name. Ex.: <button onclick='${fn}'>",
    2: "requested slot is not found",
    3: "to render a template into a list, every list items must be a Template instance."
};

/**
 * 
 */
class TemplateError extends Error {
    code: number;
    metadata: any

    static INLINE_FUNCTION: number = 1;
    static SLOT_NOT_FOUND: number = 2;
    static NOT_TEMPLATE_VALUE: number = 3;

    /**
     * 
     * @param message 
     * @param code 
     * @param metadata 
     */
    constructor(message: string, code: number = -1, metadata?: any) {
        super(message);

        this.name = "TemplateError";
        this.message = message;
        this.code = code;
        this.metadata = metadata;
    }

    /**
     * 
     * @param code 
     * @param metadata 
     * @returns 
     */
    static generate(code: number, metadata?: any): TemplateError {
        const message = ERROR_MESSAGES[code];
        return new TemplateError(message, code, metadata)
    }
}

/**
 * 
 * @param metadata 
 * @returns 
 */
export const InlineFunctionError = (metadata?: any): TemplateError => 
    TemplateError.generate(TemplateError.INLINE_FUNCTION, metadata);

/**
 * 
 * @param metadata 
 * @returns 
 */
export const SlotNotFoundError = (metadata?: any): TemplateError => 
    TemplateError.generate(TemplateError.SLOT_NOT_FOUND, metadata);

/**
 * 
 * @param metadata 
 * @returns 
 */
export const IsNotTemplateError = (metadata?: any): TemplateError => 
    TemplateError.generate(TemplateError.NOT_TEMPLATE_VALUE, metadata);

export { TemplateError };