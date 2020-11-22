import React, { useState } from 'react';
import { fireEvent, render } from '@testing-library/react';

import { ScrollDestination, ScrollDestinations } from '..';

import { MockedLogger } from '../../../test/utilts/MockedLogger';
import { mockConsole } from '../../../test/utilts/Console';

type Id = 'A';

afterEach(() => jest.clearAllMocks());

const RenderHelper = (): JSX.Element => {
    const [visible, setVisibility] = useState(true);

    return (
        <>
            <button onClick={() => setVisibility(!visible)} />
            {visible && <ScrollDestination<Id> scrollId="A" />}
        </>
    );
};

describe('ScrollDestination', () => {
    it('ScrollDestination will fail to render outside of hook', () => {
        const { error } = mockConsole();
        expect(() => render(<ScrollDestination<Id> scrollId="A" />)).toThrowError();
        expect(error).toBeCalledTimes(2);
    });

    it('Deregisters ref when component is unmounted', () => {
        /**
         * Mock
         */
        const logger = new MockedLogger();

        const rendered = render(
            <ScrollDestinations logger={logger}>
                <RenderHelper />
            </ScrollDestinations>,
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
        expect(logger.onScroll).toBeCalledTimes(0);
        expect(logger.onRegister).toBeCalledWith('A');
        expect(logger.onDeregister).toBeCalledWith('A');
        expect(logger.onScrollerNotSuccessful).toBeCalledTimes(0);

        fireEvent.click(button);

        expect(logger.onDestinationNotFound).toBeCalledTimes(0);
        expect(logger.onScroll).toBeCalledTimes(0);
        expect(logger.onRegister).toBeCalledTimes(2);
        expect(logger.onDeregister).toBeCalledWith('A');
        expect(logger.onScrollerNotSuccessful).toBeCalledTimes(0);

        fireEvent.click(button);

        expect(logger.onDestinationNotFound).toBeCalledTimes(0);
        expect(logger.onScroll).toBeCalledTimes(0);
        expect(logger.onRegister).toBeCalledTimes(2);
        expect(logger.onDeregister).toBeCalledTimes(2);
        expect(logger.onScrollerNotSuccessful).toBeCalledTimes(0);
    });
});
