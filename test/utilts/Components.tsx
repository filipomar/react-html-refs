import React from 'react';

import { useDestination, DestionationsProps } from '../../src/infrastructure';

type TestButtonProps<I> = { destinationId: I } & Omit<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, 'onClick'> &
    Pick<DestionationsProps, 'handler'>;

export const TestButton = <I extends string>({ destinationId, handler, ...props }: TestButtonProps<I>): JSX.Element => {
    const { handle } = useDestination<I>(destinationId);
    return <button {...props} onClick={() => handle(handler)} />;
};
