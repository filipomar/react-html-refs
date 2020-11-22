import React from 'react';
import { useScrollDestination } from '../../src';
import { ScrollDestionationProps } from '../../src/react/ScrollDestinations.context';

type TestButtonProps<I> = { scrollId: I } & Omit<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, 'onClick'> &
    Pick<ScrollDestionationProps, 'scrollers'>;

export const TestButton = <I extends string>({ scrollId, scrollers, ...props }: TestButtonProps<I>): JSX.Element => {
    const { scroll } = useScrollDestination<I>(scrollId);
    return <button {...props} onClick={() => scroll(scrollers)} />;
};
