import React from 'react';
import { useScrollDestination, ScrollDestionationsProps } from '../../src/infrastructure';

type TestButtonProps<I> = { scrollId: I } & Omit<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, 'onClick'> &
    Pick<ScrollDestionationsProps, 'scroller'>;

export const TestButton = <I extends string>({ scrollId, scroller: scrollers, ...props }: TestButtonProps<I>): JSX.Element => {
    const { scroll } = useScrollDestination<I>(scrollId);
    return <button {...props} onClick={() => scroll(scrollers)} />;
};
