import React, { createContext, useContext, createRef, FC, RefObject, useMemo } from 'react';

import { Logger } from '../../domain/Logger';
import { Scroller } from '../../domain/Scroller';
import { Optional } from '../../utils/Types';

type ScrollDestinationsState = {
    /**
     * Internal control
     */
    readonly destinations: Map<string, RefObject<unknown>>;

    /**
     * Logger, if you want to know what is happening inside the scroller
     */
    readonly logger: Partial<Logger>;

    /**
     * The scrolling strategy
     */
    readonly scroller?: Scroller;
};

const ScrollDestinationsContext = createContext<ScrollDestinationsState | null>(null);

export type ScrollDestionationsProps = Optional<Pick<ScrollDestinationsState, 'logger' | 'scroller'>>;
export const ScrollDestinations: FC<ScrollDestionationsProps> = ({ logger = {}, scroller, children }): JSX.Element => {
    /**
     * This hook can be treated as a map, as updates on its refs should not cause a re-render
     */
    const destinations = useMemo(() => new Map(), []);
    return <ScrollDestinationsContext.Provider value={{ destinations, scroller, logger }}>{children}</ScrollDestinationsContext.Provider>;
};

interface DestinationHook<E> {
    /**
     * Execute when you want to scroll to the referenced destination
     * @param the scroller to override the general scroller to be used
     */
    scroll: (scroller?: Scroller) => boolean;

    /**
     * Register the destination point
     */
    register: () => RefObject<E>;

    /**
     * De-register the destination point
     */
    deregister: () => void;
}

export const useScrollDestination = <I extends string, E extends HTMLElement = HTMLElement>(id: I): DestinationHook<E> => {
    const context = useContext(ScrollDestinationsContext);
    if (!context) {
        throw new Error('useScrollDestination must be used within a ScrollDestinations Context');
    }

    const { logger, destinations, scroller } = context;

    return {
        scroll: (argsScroller) => {
            const current = (destinations.get(id) as RefObject<E>)?.current;
            if (!current) {
                /**
                 * Ref is not present, scroll is impossible, attempt to log
                 */
                logger.onDestinationNotFound?.(id);
                return false;
            }

            /**
             * Resolve how we should scroll to the element
             */
            const successful = (argsScroller || scroller)?.(current);

            /**
             * Stop on first scroller that is succesful
             */
            if (successful) {
                logger.onScroll?.(id);
            } else {
                logger.onScrollerNotSuccessful?.();
            }

            return Boolean(successful);
        },
        register: () => {
            if (!destinations.has(id)) {
                /**
                 * Log that it is being created
                 */
                logger.onRegister?.(id);
            }

            /**
             * Register ref and return it
             */
            const ref = (destinations.get(id) as RefObject<E>) || createRef<E>();
            destinations.set(id, ref);
            return ref;
        },
        deregister: () => {
            logger.onDeregister?.(id);
            destinations.delete(id);
        },
    };
};
