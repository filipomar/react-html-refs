import { Scroller } from '../domain/Scroller';

/**
 * If your scroller throws an error, then it will be caught here and silenced
 * @param scroller
 */
export const silence = (scroller: Scroller): Scroller => (el) => {
    try {
        return scroller(el);
    } catch (e) {
        return false;
    }
};

/**
 * Wraps the given function that does not have an expected return
 * And if it returns void as expected, then it will consider the scroll as succesfull
 *
 * @param burrito to be wrapped
 * @param expectedReturn
 */
export const wrapUnknown = (burrito: (el: HTMLElement) => unknown, expectedReturn?: unknown): Scroller => (el) => burrito(el) === expectedReturn;

/**
 * Chains any amount of scrollers in order to handle partial failure
 */
export const chain = (...scrollers: Scroller[]): Scroller => (el) => scrollers.some((s) => s(el));
