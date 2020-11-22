import { Logger } from '../../src/domain/Logger';

export class MockedLogger implements Logger {
    onDestinationNotFound = jest.fn();
    onHandled = jest.fn();
    onDeregister = jest.fn();
    onRegister = jest.fn();
    onHandlerNotSuccessful = jest.fn();
}
