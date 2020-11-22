import { Logger } from '../../src/domain/Logger';

export class MockedLogger implements Logger {
    onDestinationNotFound = jest.fn();
    onScroll = jest.fn();
    onDeregister = jest.fn();
    onRegister = jest.fn();
    onScrollerNotSuccessful = jest.fn();
}
