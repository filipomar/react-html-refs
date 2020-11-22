import { Logger } from '../../src/domain/Logger';

export class MockedLogger implements Logger {
    onDestinationNotFound = jest.fn();
    onScroll = jest.fn();
    onRegister = jest.fn();
    onNoResolvedScrollers = jest.fn();
    onResolvedScrollersNotSuccessful = jest.fn();
}
