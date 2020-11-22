import React, { useState } from 'react';
import { fireEvent, render } from '@testing-library/react';

import { Destination, Destinations } from '..';

import { MockedLogger } from '../../../test/utilts/MockedLogger';
import { mockConsole } from '../../../test/utilts/Console';

type Id = 'A';

afterEach(() => jest.clearAllMocks());

const RenderHelper = (): JSX.Element => {
    const [visible, setVisibility] = useState(true);

    return (
        <>
            <button onClick={() => setVisibility(!visible)} />
            {visible && <Destination<Id> destinationId="A" />}
        </>
    );
};

describe('Destination', () => {
    it('Destination will fail to render outside of hook', () => {
        const { error } = mockConsole();
        expect(() => render(<Destination<Id> destinationId="A" />)).toThrowError();
        expect(error).toBeCalledTimes(2);
    });

    it('Deregisters ref when component is unmounted', () => {
        /**
         * Mock
         */
        const logger = new MockedLogger();

        const rendered = render(
            <Destinations logger={logger}>
                <RenderHelper />
            </Destinations>,
        );
        /**
         * Make sure destination rendered
         */
        const button = rendered.container.querySelector('button');
        if (!button) {
            fail('Button not rendered');
        }
        fireEvent.click(button);

        expect(logger.onDestinationNotFound).toBeCalledTimes(0);
        expect(logger.onHandled).toBeCalledTimes(0);
        expect(logger.onRegister).toBeCalledWith('A');
        expect(logger.onDeregister).toBeCalledWith('A');
        expect(logger.onHandlerNotSuccessful).toBeCalledTimes(0);

        fireEvent.click(button);

        expect(logger.onDestinationNotFound).toBeCalledTimes(0);
        expect(logger.onHandled).toBeCalledTimes(0);
        expect(logger.onRegister).toBeCalledTimes(2);
        expect(logger.onDeregister).toBeCalledWith('A');
        expect(logger.onHandlerNotSuccessful).toBeCalledTimes(0);

        fireEvent.click(button);

        expect(logger.onDestinationNotFound).toBeCalledTimes(0);
        expect(logger.onHandled).toBeCalledTimes(0);
        expect(logger.onRegister).toBeCalledTimes(2);
        expect(logger.onDeregister).toBeCalledTimes(2);
        expect(logger.onHandlerNotSuccessful).toBeCalledTimes(0);
    });
});
