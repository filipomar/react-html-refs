import { DebugLogger } from '..';

import { mockConsole } from '../../../test/utilts/Console';

afterEach(() => jest.clearAllMocks());

describe('DebugLogger', () => {
    it('handles onDestinationNotFound as a wanring', () => {
        const console = mockConsole();
        const logger = new DebugLogger();
        logger.onDestinationNotFound('id');

        expect(console.error).toBeCalledTimes(0);
        expect(console.warn).toBeCalledTimes(1);
        expect(console.debug).toBeCalledTimes(0);
    });

    it('handles onScroll as debug', () => {
        const console = mockConsole();
        const logger = new DebugLogger();
        logger.onScroll('id');

        expect(console.error).toBeCalledTimes(0);
        expect(console.warn).toBeCalledTimes(0);
        expect(console.debug).toBeCalledTimes(1);
    });

    it('handles onRegister as debug', () => {
        const console = mockConsole();
        const logger = new DebugLogger();
        logger.onRegister('id');

        expect(console.error).toBeCalledTimes(0);
        expect(console.warn).toBeCalledTimes(0);
        expect(console.debug).toBeCalledTimes(1);
    });

    it('handles onNoResolvedScrollers as a wanring', () => {
        const console = mockConsole();
        const logger = new DebugLogger();
        logger.onNoResolvedScrollers();

        expect(console.error).toBeCalledTimes(0);
        expect(console.warn).toBeCalledTimes(1);
        expect(console.debug).toBeCalledTimes(0);
    });

    it('handles onResolvedScrollersNotSuccessful as a wanring', () => {
        const console = mockConsole();
        const logger = new DebugLogger();
        logger.onResolvedScrollersNotSuccessful();

        expect(console.error).toBeCalledTimes(0);
        expect(console.warn).toBeCalledTimes(1);
        expect(console.debug).toBeCalledTimes(0);
    });
});
