import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { ScrollDestinations, ScrollDestination } from '..';

import { MockedLogger } from '../../../test/utilts/MockedLogger';
import { TestButton } from '../../../test/utilts/Components';
import { mockConsole } from '../../../test/utilts/Console';

type Id = 'A' | 'B' | 'C';

afterEach(() => jest.clearAllMocks());

describe('ScrollDestinations', () => {
    it('ScrollDestination will fail to render outside of hook', () => {
        const { error } = mockConsole();

        expect(() => render(<ScrollDestination<Id> scrollId="A" style={{ background: 'red' }} />)).toThrowError();
        expect(error).toBeCalledTimes(2);
    });

    it('Scrolls to point when clicked', () => {
        /**
         * Mock
         */
        const logger = new MockedLogger();
        const scrollToMock = jest.fn();
        Element.prototype.scrollTo = scrollToMock;

        const rendered = render(
            <ScrollDestinations scrollers="scrollTo" logger={logger}>
                <ScrollDestination<Id> scrollId="A" style={{ background: 'red' }} />
                <TestButton<Id> scrollId="A" />
            </ScrollDestinations>,
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
        expect(logger.onScroll).toBeCalledWith('A');
        expect(logger.onRegister).toBeCalledWith('A');
        expect(logger.onNoResolvedScrollers).toBeCalledTimes(0);
        expect(logger.onResolvedScrollersNotSuccessful).toBeCalledTimes(0);
        expect(scrollToMock).toBeCalledTimes(1);
    });

    it('Scrolls to point when clicked even without logger', () => {
        /**
         * Mock
         */
        const scrollToMock = jest.fn();
        Element.prototype.scrollTo = scrollToMock;

        const rendered = render(
            <ScrollDestinations scrollers="scrollTo">
                <ScrollDestination<Id> scrollId="A" style={{ background: 'red' }} />
                <TestButton<Id> scrollId="A" />
            </ScrollDestinations>,
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

    it('Does not scrolls to point when clicked without logger but throws no error', () => {
        /**
         * Mock
         */
        const scrollToMock = jest.fn();
        Element.prototype.scrollTo = scrollToMock;

        const rendered = render(
            <ScrollDestinations scrollers="scrollTo">
                <TestButton<Id> scrollId="A" />
            </ScrollDestinations>,
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
            <ScrollDestinations logger={logger}>
                <ScrollDestination<Id> scrollId="A" style={{ background: 'red' }} />
                <TestButton<Id> scrollId="A" scrollers={customScroller} />
            </ScrollDestinations>,
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
        expect(logger.onScroll).toBeCalledTimes(0);
        expect(logger.onRegister).toBeCalledTimes(1);
        expect(logger.onNoResolvedScrollers).toBeCalledTimes(0);
        expect(logger.onResolvedScrollersNotSuccessful).toBeCalledTimes(1);
        expect(customScroller).toBeCalledWith(rendered.container.querySelector('div[style]'));
    });

    it("Won't scroll if element hasn't been registered", () => {
        /**
         * Mock
         */
        const logger = new MockedLogger();

        const rendered = render(
            <ScrollDestinations logger={logger}>
                <TestButton<Id> scrollId="A" />
            </ScrollDestinations>,
        );

        const button = rendered.container.querySelector('button');
        if (!button) {
            fail('Button not rendered');
        }

        fireEvent.click(button);

        expect(logger.onDestinationNotFound).toBeCalledTimes(1);
        expect(logger.onScroll).toBeCalledTimes(0);
        expect(logger.onRegister).toBeCalledTimes(0);
        expect(logger.onNoResolvedScrollers).toBeCalledTimes(0);
        expect(logger.onResolvedScrollersNotSuccessful).toBeCalledTimes(0);
    });

    it('Logs when no scrollers are found', () => {
        /**
         * Mock
         */
        const logger = new MockedLogger();

        const rendered = render(
            <ScrollDestinations logger={logger}>
                <ScrollDestination<Id> scrollId="A" style={{ background: 'red' }} />
                <TestButton<Id> scrollId="A" />
            </ScrollDestinations>,
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
        expect(logger.onScroll).toBeCalledTimes(0);
        expect(logger.onRegister).toBeCalledTimes(1);
        expect(logger.onNoResolvedScrollers).toBeCalledTimes(1);
        expect(logger.onResolvedScrollersNotSuccessful).toBeCalledTimes(0);
    });

    it('Works with more than one scroller', () => {
        /**
         * Mock
         */
        const logger = new MockedLogger();
        const scrollToMock = jest.fn();
        Element.prototype.scrollBy = scrollToMock;

        const rendered = render(
            <ScrollDestinations scrollers={['scrollIntoView', 'scrollBy', 'scrollTo']} logger={logger}>
                <ScrollDestination<Id> scrollId="A" style={{ background: 'red' }} />
                <TestButton<Id> scrollId="A" />
            </ScrollDestinations>,
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
        expect(logger.onScroll).toBeCalledWith('A');
        expect(logger.onRegister).toBeCalledWith('A');
        expect(logger.onNoResolvedScrollers).toBeCalledTimes(0);
        expect(logger.onResolvedScrollersNotSuccessful).toBeCalledTimes(0);
        expect(scrollToMock).toBeCalledTimes(1);
    });

    it('Scrolls to last item if registration is dupilcate', () => {
        /**
         * Mock
         */
        const logger = new MockedLogger();
        const scrollerMock = jest.fn().mockReturnValue(true);

        const rendered = render(
            <ScrollDestinations scrollers={scrollerMock} logger={logger}>
                <ScrollDestination<Id> scrollId="A" id="RED" style={{ background: 'red' }} />
                <ScrollDestination<Id> scrollId="A" id="BLUE" style={{ background: 'blue' }} />
                <TestButton<Id> scrollId="A" />
            </ScrollDestinations>,
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
        expect(logger.onScroll).toBeCalledWith('A');
        expect(logger.onRegister).toBeCalledWith('A');
        expect(logger.onNoResolvedScrollers).toBeCalledTimes(0);
        expect(logger.onResolvedScrollersNotSuccessful).toBeCalledTimes(0);
        expect(scrollerMock).toBeCalledWith(rendered.container.querySelector('#BLUE'));
    });
});
