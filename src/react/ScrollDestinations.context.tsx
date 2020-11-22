import React, { createContext, useContext, createRef, FC, RefObject, useMemo } from 'react';

import { Optional } from '../utils/Types';

import { Logger } from '../domain/Logger';
import { Scroller } from '../domain/Scroller';

import scrollers, { buildScroller, ScrollerBuilderKey } from './ScrollerBuilders';

type ScrollDestinationsState = {
    /**
     * Internal control
     */
    readonly destinations: Map<string, RefObject<unknown>>;

    /**
     * Logger, if you want to know what is happening inside the scroller
     */
    readonly logger?: Partial<Logger>;

    /**
     * The strategies the `scroll` hook should use
     */
    readonly scrollers: ScrollerBuilderKey | ScrollerBuilderKey[] | ((el: HTMLElement) => boolean);
};

const ScrollDestinationsContext = createContext<ScrollDestinationsState | null>(null);

export type ScrollDestionationProps = Optional<Pick<ScrollDestinationsState, 'logger' | 'scrollers'>, 'scrollers'>;
export const ScrollDestinations: FC<ScrollDestionationProps> = ({ logger, scrollers = [], children }): JSX.Element => {
    /**
     * This hook can be treated as a map, as updates on its refs should not cause a re-render
     */
    const destinations = useMemo(() => new Map(), []);
    return <ScrollDestinationsContext.Provider value={{ destinations, scrollers, logger }}>{children}</ScrollDestinationsContext.Provider>;
};

type DestinationHook<E> = {
    /**
     * Execute when you want to scroll to the referenced destination
     */
    scroll: (args?: ScrollDestinationsState['scrollers']) => void;

    /**
     * Register the destination point
     */
    register: () => RefObject<E>;
};

const resolveScrollers = (el: HTMLElement, args: ScrollDestinationsState['scrollers']): Scroller[] => {
    if (typeof args === 'string') {
        return [scrollers[args](el)];
    }

    if (Array.isArray(args)) {
        return args.map((v) => scrollers[v](el));
    }

    return [buildScroller(el, args)];
};

export const useScrollDestination = <I extends string, E extends HTMLElement = HTMLElement>(id: I): DestinationHook<E> => {
    const context = useContext(ScrollDestinationsContext);
    if (!context) {
        throw new Error('useScrollDestination must be used within a ScrollDestinations Context');
    }

    const { logger, destinations, scrollers } = context;

    return {
        scroll: (args) => {
            const current = (destinations.get(id) as RefObject<E>)?.current;
            if (!current) {
                /**
                 * Ref is not present, scroll is impossible, attempt to log
                 */
                logger?.onDestinationNotFound?.(id);
                return;
            }

            /**
             * Resolve how we should scroll to the element
             */
            const resolvedScrollers = resolveScrollers(current, args || scrollers);
            if (resolvedScrollers.length === 0) {
                logger?.onNoResolvedScrollers?.();
                return;
            }

            const successful = resolvedScrollers.some((s) => s.scroll());

            /**
             * Stop on first scroller that is succesful
             */
            if (successful) {
                /**
                 * Log success
                 */
                logger?.onScroll?.(id);
            } else {
                /**
                 * Log failure
                 */
                logger?.onResolvedScrollersNotSuccessful?.();
            }

            return successful;
        },
        register: () => {
            if (!destinations.has(id)) {
                /**
                 * Log that it is being created
                 */
                logger?.onRegister?.(id);
            }

            /**
             * Register ref and return it
             */
            const ref = (destinations.get(id) as RefObject<E>) || createRef<E>();
            destinations.set(id, ref);
            return ref;
        },
    };
};
