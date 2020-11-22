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

    it('handles onHandled as debug', () => {
        const console = mockConsole();
        const logger = new DebugLogger();
        logger.onHandled('id');

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

    it('handles onDeregister as debug', () => {
        const console = mockConsole();
        const logger = new DebugLogger();
        logger.onDeregister('id');

        expect(console.error).toBeCalledTimes(0);
        expect(console.warn).toBeCalledTimes(0);
        expect(console.debug).toBeCalledTimes(1);
    });

    it('handles onHandlerNotSuccessful as a wanring', () => {
        const console = mockConsole();
        const logger = new DebugLogger();
        logger.onHandlerNotSuccessful();

        expect(console.error).toBeCalledTimes(0);
        expect(console.warn).toBeCalledTimes(1);
        expect(console.debug).toBeCalledTimes(0);
    });
});
