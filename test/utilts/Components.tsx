import React from 'react';

import { Handler, useDestination } from '../../src/infrastructure';

type ButtonProps = Omit<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, 'onClick'>;

type TestButtonProps<I, H extends string> = { destinationId: I; handler?: Handler; handlerCategory?: H } & ButtonProps;

export const TestButton = <I extends string, H extends string = string>({ destinationId, handler, handlerCategory, ...props }: TestButtonProps<I, H>): JSX.Element => {
    const { handle } = useDestination<I, H>(destinationId);
    return <button {...props} onClick={() => handle(handlerCategory ? handlerCategory : handler)} />;
};
