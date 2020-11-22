/**
 * @param element to be handled
 * @returns if it was successful on handling
 */
export type Handler = (el: HTMLElement) => boolean;

/**
 * If your handler throws an error, then it will be caught here and silenced
 */
export const silence = (handler: Handler): Handler => (el) => {
    try {
        return handler(el);
    } catch (e) {
        return false;
    }
};

/**
 * Wraps the given function that does not have an expected return
 *
 * @param burrito to be wrapped
 * @param expectedReturn
 */
export const wrapUnknown = (burrito: (el: HTMLElement) => unknown, expectedReturn?: unknown): Handler => (el) => burrito(el) === expectedReturn;

/**
 * Chains any amount of handlers in order to handle partial failure
 */
export const chain = (...handlers: Handler[]): Handler => (el) => handlers.some((h) => h(el));
