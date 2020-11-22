import { PropsWithChildren, createElement } from 'react';

import { useScrollDestination } from './ScrollDestinations.context';

type ScrollDestinationProps<T, E extends keyof JSX.IntrinsicElements> = {
    /**
     * The id of the destination this `useDestination(id).scroll()` can scroll to
     */
    readonly scrollId: T;

    /**
     * The element to be generated
     */
    readonly elementType?: E;
} & Omit<JSX.IntrinsicElements[E], 'ref'>;

/**
 * A scroll destination hook as a React component
 */
export const ScrollDestination = <T extends string, E extends keyof JSX.IntrinsicElements = 'div'>({
    scrollId,
    elementType,
    ...other
}: PropsWithChildren<ScrollDestinationProps<T, E>>): JSX.Element => createElement(elementType || 'div', { ...other, ref: useScrollDestination(scrollId).register() });
