import React, { createContext, useContext, createRef, RefObject, useMemo, PropsWithChildren } from 'react';

import { Logger } from '../../domain/Logger';
import { Handler } from '../../domain/Handler';
import { Optional } from '../../utils/Types';

type DestinationsState<H extends string> = {
    /**
     * Internal control of destinations
     */
    readonly destinations: Map<string, RefObject<unknown>>;

    /**
     * Loggin of the provider and its hooks
     */
    readonly logger: Partial<Logger>;

    /**
     * The handler strategy(ies)
     */
    readonly defaultHandler?: Handler;
    readonly handlers: Record<H, Handler>;
};

const DestinationsContext = createContext<DestinationsState<string> | null>(null);

export type DestionationsProps<H extends string> = PropsWithChildren<Optional<Pick<DestinationsState<H>, 'logger' | 'defaultHandler' | 'handlers'>>>;
export const Destinations = <H extends string>({ logger = {}, defaultHandler, handlers, children }: DestionationsProps<H>): JSX.Element => {
    /**
     * This hook can be treated as a map, as updates on its refs should not cause a re-render
     */
    const destinations = useMemo(() => new Map(), []);
    return <DestinationsContext.Provider value={{ destinations, defaultHandler, handlers: handlers || {}, logger }}>{children}</DestinationsContext.Provider>;
};

export interface DestinationHook<E, H extends string = string> {
    /**
     * Execute the given category or handler on the reference HTMLElement
     */
    handle: (customhandlerOrHandlerCategory?: Handler | H) => boolean;

    /**
     * Register the destination
     */
    register: () => RefObject<E>;

    /**
     * If you don't want to use the library as it was intended, go ahead
     * @deprecated I'm still shaming you
     */
    getHTMLElement: () => HTMLElement | null;

    /**
     * De-register the destination
     */
    deregister: () => void;
}

const resolveHandler = <H extends string>(
    { defaultHandler, handlers }: Pick<DestinationsState<H>, 'defaultHandler' | 'handlers'>,
    argsHandlerOrCategory?: Handler | H,
): Handler | null => {
    if (!argsHandlerOrCategory) {
        /**
         * Nothing is provided, use fallback
         */
        return defaultHandler || null;
    }

    if (typeof argsHandlerOrCategory === 'string') {
        /**
         * Intent to use category
         */
        return handlers[argsHandlerOrCategory] || null;
    }

    /**
     * Intent to use custom handler
     */
    return argsHandlerOrCategory;
};

const useDestinationsState = <H extends string>(): DestinationsState<H> => {
    const context = useContext(DestinationsContext);
    if (!context) {
        throw new Error('Destination hooks must be used within a Destinations Context');
    }

    return context;
};

export const useDestinations = <I extends string, H extends string = string, E extends HTMLElement = HTMLElement>(): ((id: I) => DestinationHook<E, H>) => {
    const { logger, destinations, ...handlers } = useDestinationsState();

    return (id) => {
        const getHTMLElement = () => (destinations.get(id) as RefObject<E>)?.current || null;

        return {
            handle: (argsHandlerOrCategory) => {
                const current = getHTMLElement();
                if (!current) {
                    /**
                     * Ref is not present, handling is impossible, log
                     */
                    logger.onDestinationNotFound?.(id);
                    return false;
                }

                /**
                 * Resolve how we should handle to the element
                 */
                const isSuccessful = resolveHandler(handlers, argsHandlerOrCategory)?.(current);
                if (isSuccessful) {
                    logger.onHandled?.(id);
                } else {
                    logger.onHandlerNotSuccessful?.();
                }

                return Boolean(isSuccessful);
            },
            getHTMLElement,
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
};

export const useDestination = <I extends string, H extends string = string, E extends HTMLElement = HTMLElement>(id: I): DestinationHook<E, H> => useDestinations<I, H, E>()(id);
