import { PropsWithChildren, createElement, useEffect } from 'react';

import { useDestination } from '../Destinations/Destinations.context';

type DestinationProps<T, E extends keyof JSX.IntrinsicElements> = {
    /**
     * Interally executes `useDestination(id).handle()`
     */
    readonly destinationId: T;

    /**
     * The element to be generated
     */
    readonly elementType?: E;
} & Omit<JSX.IntrinsicElements[E], 'ref'>;

/**
 * A useDestination hook as a React component
 */
export const Destination = <T extends string, E extends keyof JSX.IntrinsicElements = 'div'>({
    destinationId,
    elementType,
    ...other
}: PropsWithChildren<DestinationProps<T, E>>): JSX.Element => {
    const { register, deregister } = useDestination(destinationId);

    /**
     * Drop the ref once this is unmounted
     */
    useEffect(() => deregister, []);

    return createElement(elementType || 'div', { ...other, ref: register() });
};
