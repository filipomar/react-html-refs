import React from 'react';
import { useScrollDestination } from '../../src/infrastructure/react';
import { ScrollDestionationProps } from '../../src/infrastructure/react/ScrollDestinations.context';

type TestButtonProps<I> = { scrollId: I } & Omit<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, 'onClick'> &
    Pick<ScrollDestionationProps, 'scrollers'>;

export const TestButton = <I extends string>({ scrollId, scrollers, ...props }: TestButtonProps<I>): JSX.Element => {
    const { scroll } = useScrollDestination<I>(scrollId);
    return <button {...props} onClick={() => scroll(scrollers)} />;
};
