import { Scroller } from '../../domain/Scroller';

class HtmlElementScroller implements Scroller {
    private static executors = {
        scrollTo: (el: HTMLElement) => el.scrollTo(),
        scrollIntoView: (el: HTMLElement) => el.scrollIntoView(),
        scrollBy: (el: HTMLElement) => el.scrollBy(),
    };

    private readonly el: HTMLElement;
    private readonly executor: (el: HTMLElement) => void;
    private readonly has: boolean;

    constructor(el: HTMLElement, executionName: keyof typeof HtmlElementScroller['executors']) {
        this.el = el;
        this.has = executionName in this.el;
        this.executor = HtmlElementScroller.executors[executionName];
    }

    scroll(): boolean {
        if (this.has) {
            this.executor(this.el);
        }
        return this.has;
    }
}

const defaultBuilders = {
    scrollTo: (el: HTMLElement): Scroller => new HtmlElementScroller(el, 'scrollTo'),
    scrollIntoView: (el: HTMLElement): Scroller => new HtmlElementScroller(el, 'scrollIntoView'),
    scrollBy: (el: HTMLElement): Scroller => new HtmlElementScroller(el, 'scrollBy'),
    // TODO Implement others
    // scrollTop: (el: HTMLElement): Scroller => new HtmlElementScroller(el, 'scrollTop'),
    // scrollLeft: (el: HTMLElement): Scroller => new HtmlElementScroller(el, 'scrollLeft'),
};

export type ScrollerBuilderKey = keyof typeof defaultBuilders;
export type ScrollerBuilder = typeof defaultBuilders[ScrollerBuilderKey];

export default defaultBuilders as Record<ScrollerBuilderKey, ScrollerBuilder>;

export const buildScroller = (el: HTMLElement, customScroller: (el: HTMLElement) => boolean): Scroller => ({ scroll: () => customScroller(el) });
