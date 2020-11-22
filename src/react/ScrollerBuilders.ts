import { Scroller } from '../domain/Scroller';

class HtmlElementScroller<E extends keyof typeof HtmlElementScroller['executors'], P extends Parameters<HTMLElement[E]>[0]> implements Scroller {
    private static executors = {
        scrollTo: (el: HTMLElement, options?: ScrollToOptions) => el.scrollTo(options),
        scrollIntoView: (el: HTMLElement, arg?: boolean | ScrollIntoViewOptions) => el.scrollIntoView(arg),
        scrollBy: (el: HTMLElement, options?: ScrollToOptions) => el.scrollBy(options),
    };

    private readonly el: HTMLElement;
    private readonly executor: (el: HTMLElement, args?: P) => void;
    private readonly args: P | undefined;
    private readonly has: boolean;

    constructor(el: HTMLElement, executionName: E, args?: P) {
        this.el = el;
        this.has = executionName in this.el;
        this.args = args;
        this.executor = HtmlElementScroller.executors[executionName] as (el: HTMLElement, args?: P) => void;
    }

    scroll(): boolean {
        if (this.has) {
            this.executor(this.el, this.args);
        }
        return this.has;
    }
}

const defaultBuilders = {
    scrollTo: (el: HTMLElement): Scroller => new HtmlElementScroller(el, 'scrollTo'),
    scrollIntoView: (el: HTMLElement): Scroller => new HtmlElementScroller(el, 'scrollIntoView', { behavior: 'smooth' }),
    scrollIntoCenteredView: (el: HTMLElement): Scroller => new HtmlElementScroller(el, 'scrollIntoView', { behavior: 'smooth', block: 'center', inline: 'center' }),
    scrollBy: (el: HTMLElement): Scroller => new HtmlElementScroller(el, 'scrollBy'),
    // TODO Implement others
    // scrollTop: (el: HTMLElement): Scroller => new HtmlElementScroller(el, 'scrollTop'),
    // scrollLeft: (el: HTMLElement): Scroller => new HtmlElementScroller(el, 'scrollLeft'),
};

export type ScrollerBuilderKey = keyof typeof defaultBuilders;
export type ScrollerBuilder = typeof defaultBuilders[ScrollerBuilderKey];

export default defaultBuilders as Record<ScrollerBuilderKey, ScrollerBuilder>;

export const buildScroller = (el: HTMLElement, customScroller: (el: HTMLElement) => boolean): Scroller => ({ scroll: () => customScroller(el) });
