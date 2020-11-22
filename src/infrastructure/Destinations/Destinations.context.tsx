import React, { createContext, useContext, createRef, FC, RefObject, useMemo } from 'react';

import { Logger } from '../../domain/Logger';
import { Handler } from '../../domain/Handler';
import { Optional } from '../../utils/Types';

type DestinationsState = {
    /**
     * Internal control
     */
    readonly destinations: Map<string, RefObject<unknown>>;

    /**
     * Logger, if you want to know what is happening inside this provider
     */
    readonly logger: Partial<Logger>;

    /**
     * The handler strategy
     */
    readonly handler?: Handler;
};

const DestinationsContext = createContext<DestinationsState | null>(null);

export type DestionationsProps = Optional<Pick<DestinationsState, 'logger' | 'handler'>>;
export const Destinations: FC<DestionationsProps> = ({ logger = {}, handler, children }): JSX.Element => {
    /**
     * This hook can be treated as a map, as updates on its refs should not cause a re-render
     */
    const destinations = useMemo(() => new Map(), []);
    return <DestinationsContext.Provider value={{ destinations, handler, logger }}>{children}</DestinationsContext.Provider>;
};

interface DestinationHook<E> {
    /**
     * Execute when you want to handle the referenced destination
     * @param the handler to override the general handler to be used
     */
    handle: (handler?: Handler) => boolean;

    /**
     * Register the destination point
     */
    register: () => RefObject<E>;

    /**
     * De-register the destination point
     */
    deregister: () => void;
}

export const useDestination = <I extends string, E extends HTMLElement = HTMLElement>(id: I): DestinationHook<E> => {
    const context = useContext(DestinationsContext);
    if (!context) {
        throw new Error('useDestination must be used within a Destinations Context');
    }

    const { logger, destinations, handler } = context;

    return {
        handle: (argsHandler) => {
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
            const isSuccessful = (argsHandler || handler)?.(current);
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
