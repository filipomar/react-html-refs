import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { Destinations, Destination, chain, silence, wrapUnknown } from '..';

import { MockedLogger } from '../../../test/utilts/MockedLogger';
import { TestButton } from '../../../test/utilts/Components';
import { mockConsole } from '../../../test/utilts/Console';

type Id = 'A' | 'B' | 'C';

afterEach(() => jest.clearAllMocks());

describe('Destinations', () => {
    it('Destination will fail to render outside of hook', () => {
        const { error } = mockConsole();

        expect(() => render(<Destination<Id> destinationId="A" style={{ background: 'red' }} />)).toThrowError();
        expect(error).toBeCalledTimes(2);
    });

    it('Scrolls to point when clicked', () => {
        /**
         * Mock
         */
        const logger = new MockedLogger();
        const scrollToMock = jest.fn();

        const rendered = render(
            <Destinations defaultHandler={chain(silence(wrapUnknown(scrollToMock)))} logger={logger}>
                <Destination<Id> destinationId="A" style={{ background: 'red' }} />
                <TestButton<Id> destinationId="A" />
            </Destinations>,
        );

        /**
         * Make sure destination rendered
         */
        expect(rendered.container.querySelector('div[style]')).not.toBeNull();

        const button = rendered.container.querySelector('button');

        if (!button) {
            fail('Button not rendered');
        }

        fireEvent.click(button);

        expect(logger.onDestinationNotFound).toBeCalledTimes(0);
        expect(logger.onHandled).toBeCalledWith('A');
        expect(logger.onRegister).toBeCalledWith('A');
        expect(logger.onDeregister).toBeCalledTimes(0);
        expect(logger.onHandlerNotSuccessful).toBeCalledTimes(0);
        expect(scrollToMock).toBeCalledTimes(1);
    });

    it('Scrolls to point when clicked even without logger', () => {
        /**
         * Mock
         */
        const scrollToMock = jest.fn();

        const rendered = render(
            <Destinations defaultHandler={chain(silence(wrapUnknown(scrollToMock)))}>
                <Destination<Id> destinationId="A" style={{ background: 'red' }} />
                <TestButton<Id> destinationId="A" />
            </Destinations>,
        );

        /**
         * Make sure destination rendered
         */
        expect(rendered.container.querySelector('div[style]')).not.toBeNull();

        const button = rendered.container.querySelector('button');

        if (!button) {
            fail('Button not rendered');
        }

        fireEvent.click(button);

        expect(scrollToMock).toBeCalledTimes(1);
    });

    it("Won't scroll if element hasn't been registered, but even without a logger will not throw errors", () => {
        /**
         * Mock
         */
        const scrollToMock = jest.fn();

        const rendered = render(
            <Destinations defaultHandler={chain(silence(wrapUnknown(scrollToMock)))}>
                <TestButton<Id> destinationId="A" />
            </Destinations>,
        );

        const button = rendered.container.querySelector('button');

        if (!button) {
            fail('Button not rendered');
        }

        fireEvent.click(button);

        expect(scrollToMock).toHaveBeenCalledTimes(0);
    });

    it('Uses custom scroller even if it fails', () => {
        /**
         * Mock
         */
        const logger = new MockedLogger();
        const customScroller = jest.fn().mockReturnValue(false);

        const rendered = render(
            <Destinations logger={logger}>
                <Destination<Id> destinationId="A" style={{ background: 'red' }} />
                <TestButton<Id> destinationId="A" handler={customScroller} />
            </Destinations>,
        );

        /**
         * Make sure destination rendered
         */
        expect(rendered.container.querySelector('div[style]')).not.toBeNull();

        const button = rendered.container.querySelector('button');

        if (!button) {
            fail('Button not rendered');
        }

        fireEvent.click(button);

        expect(logger.onDestinationNotFound).toBeCalledTimes(0);
        expect(logger.onHandled).toBeCalledTimes(0);
        expect(logger.onRegister).toBeCalledTimes(1);
        expect(logger.onDeregister).toBeCalledTimes(0);
        expect(logger.onHandlerNotSuccessful).toBeCalledTimes(1);
        expect(customScroller).toBeCalledWith(rendered.container.querySelector('div[style]'));
    });

    it("Won't scroll if element hasn't been registered", () => {
        /**
         * Mock
         */
        const logger = new MockedLogger();

        const rendered = render(
            <Destinations logger={logger}>
                <TestButton<Id> destinationId="A" />
            </Destinations>,
        );

        const button = rendered.container.querySelector('button');
        if (!button) {
            fail('Button not rendered');
        }

        fireEvent.click(button);

        expect(logger.onDestinationNotFound).toBeCalledTimes(1);
        expect(logger.onHandled).toBeCalledTimes(0);
        expect(logger.onRegister).toBeCalledTimes(0);
        expect(logger.onDeregister).toBeCalledTimes(0);
        expect(logger.onHandlerNotSuccessful).toBeCalledTimes(0);
    });

    it('Logs when no scrollers are found', () => {
        /**
         * Mock
         */
        const logger = new MockedLogger();

        const rendered = render(
            <Destinations logger={logger}>
                <Destination<Id> destinationId="A" style={{ background: 'red' }} />
                <TestButton<Id> destinationId="A" />
            </Destinations>,
        );

        /**
         * Make sure destination rendered
         */
        expect(rendered.container.querySelector('div[style]')).not.toBeNull();

        const button = rendered.container.querySelector('button');

        if (!button) {
            fail('Button not rendered');
        }

        fireEvent.click(button);

        expect(logger.onDestinationNotFound).toBeCalledTimes(0);
        expect(logger.onHandled).toBeCalledTimes(0);
        expect(logger.onRegister).toBeCalledTimes(1);
        expect(logger.onDeregister).toBeCalledTimes(0);
        expect(logger.onHandlerNotSuccessful).toBeCalledTimes(1);
    });

    it('Scrolls to last item if registration is duplicate', () => {
        /**
         * Mock
         */
        const logger = new MockedLogger();
        const scrollerMock = jest.fn().mockReturnValue(true);

        const rendered = render(
            <Destinations defaultHandler={scrollerMock} logger={logger}>
                <Destination<Id> destinationId="A" id="RED" style={{ background: 'red' }} />
                <Destination<Id> destinationId="A" id="BLUE" style={{ background: 'blue' }} />
                <TestButton<Id> destinationId="A" />
            </Destinations>,
        );

        /**
         * Make sure destination rendered
         */
        expect(rendered.container.querySelectorAll('div[style]')).toHaveLength(2);

        const button = rendered.container.querySelector('button');

        if (!button) {
            fail('Button not rendered');
        }

        fireEvent.click(button);

        expect(logger.onDestinationNotFound).toBeCalledTimes(0);
        expect(logger.onHandled).toBeCalledWith('A');
        expect(logger.onRegister).toBeCalledWith('A');
        expect(logger.onDeregister).toBeCalledTimes(0);
        expect(logger.onHandlerNotSuccessful).toBeCalledTimes(0);

        expect(scrollerMock).toBeCalledWith(rendered.container.querySelector('#BLUE'));
    });

    it('Handles silenced struggling scroller properly', () => {
        /**
         * Mock
         */
        const logger = new MockedLogger();
        const scrollToMock = jest.fn().mockImplementation(() => {
            throw new Error('Bruh');
        });

        const rendered = render(
            <Destinations defaultHandler={chain(silence(wrapUnknown(scrollToMock)))} logger={logger}>
                <Destination<Id> destinationId="A" style={{ background: 'red' }} />
                <TestButton<Id> destinationId="A" />
            </Destinations>,
        );

        /**
         * Make sure destination rendered
         */
        expect(rendered.container.querySelector('div[style]')).not.toBeNull();

        const button = rendered.container.querySelector('button');

        if (!button) {
            fail('Button not rendered');
        }

        fireEvent.click(button);

        expect(logger.onDestinationNotFound).toBeCalledTimes(0);
        expect(logger.onHandled).toBeCalledTimes(0);
        expect(logger.onRegister).toBeCalledWith('A');
        expect(logger.onDeregister).toBeCalledTimes(0);
        expect(logger.onHandlerNotSuccessful).toBeCalledTimes(1);
        expect(scrollToMock).toBeCalledTimes(1);
    });

    it('Will use custom handlers', () => {
        /**
         * Mock
         */
        const logger = new MockedLogger();
        const scrollToMock = jest.fn();

        type HandlerCategory = 'fakeScroll';

        const rendered = render(
            <Destinations<HandlerCategory> handlers={{ fakeScroll: chain(silence(wrapUnknown(scrollToMock))) }} logger={logger}>
                <Destination<Id> destinationId="A" style={{ background: 'red' }} />
                <TestButton<Id, HandlerCategory> destinationId="A" handlerCategory="fakeScroll" />
            </Destinations>,
        );

        /**
         * Make sure destination rendered
         */
        expect(rendered.container.querySelector('div[style]')).not.toBeNull();

        const button = rendered.container.querySelector('button');

        if (!button) {
            fail('Button not rendered');
        }

        fireEvent.click(button);

        expect(logger.onDestinationNotFound).toBeCalledTimes(0);
        expect(logger.onHandled).toBeCalledWith('A');
        expect(logger.onRegister).toBeCalledWith('A');
        expect(logger.onDeregister).toBeCalledTimes(0);
        expect(logger.onHandlerNotSuccessful).toBeCalledTimes(0);
        expect(scrollToMock).toBeCalledTimes(1);
    });

    it('Will use try custom handlers and ignore default handler if category is provided', () => {
        /**
         * Mock
         */
        const scrollToMock = jest.fn();

        type HandlerCategory = 'fakeScroll';

        const rendered = render(
            <Destinations<HandlerCategory> handlers={{ fakeScroll: chain(silence(wrapUnknown(scrollToMock))) }}>
                <Destination<Id> destinationId="A" style={{ background: 'red' }} />
                <TestButton<Id> destinationId="A" handlerCategory="fakeScroll2EletricBoogaloo" />
            </Destinations>,
        );

        /**
         * Make sure destination rendered
         */
        expect(rendered.container.querySelector('div[style]')).not.toBeNull();

        const button = rendered.container.querySelector('button');

        if (!button) {
            fail('Button not rendered');
        }

        fireEvent.click(button);

        expect(scrollToMock).toBeCalledTimes(0);
    });
});
