import React, { createContext, useContext, createRef, RefObject, useMemo, PropsWithChildren } from 'react';

import { Logger } from '../../domain/Logger';
import { Handler } from '../../domain/Handler';
import { Optional } from '../../utils/Types';

type DestinationsState<H extends string> = {
    /**
     * Internal control
     */
    readonly destinations: Map<string, RefObject<unknown>>;

    /**
     * Logger, if you want to know what is happening inside this provider
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
     * Execute when you want to handle the referenced destination
     * @param the handler to override the general handler to be used
     */
    handle: (handler?: Handler | H) => boolean;

    /**
     * Register the destination point
     */
    register: () => RefObject<E>;

    /**
     * De-register the destination point
     */
    deregister: () => void;
}

const resolveHandler = <H extends string>({ defaultHandler, handlers }: DestinationsState<H>, argsHandlerOrCategory?: Handler | H): Handler | null => {
    if (!argsHandlerOrCategory) {
        /**
         * Nothing is provided, fallback
         */
        return defaultHandler || null;
    }

    if (typeof argsHandlerOrCategory === 'string') {
        return handlers[argsHandlerOrCategory] || null;
    }

    return argsHandlerOrCategory;
};

export const useDestination = <I extends string, H extends string = string, E extends HTMLElement = HTMLElement>(id: I): DestinationHook<E, H> => {
    const context = useContext(DestinationsContext);
    if (!context) {
        throw new Error('useDestination must be used within a Destinations Context');
    }

    const { logger, destinations } = context;

    return {
        handle: (argsHandlerOrCategory) => {
            const current = (destinations.get(id) as RefObject<E>)?.current;
            if (!current) {
                /**
                 * Ref is not present, handling is impossible, attempt to log
                 */
                logger.onDestinationNotFound?.(id);
                return false;
            }

            /**
             * Resolve how we should handle to the element
             */
            const isSuccessful = resolveHandler(context, argsHandlerOrCategory)?.(current);
            if (isSuccessful) {
                logger.onHandled?.(id);
            } else {
                logger.onHandlerNotSuccessful?.();
            }

            return Boolean(isSuccessful);
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
