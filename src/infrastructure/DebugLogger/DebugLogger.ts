import { Logger } from '../../domain/Logger';

export class DebugLogger implements Logger {
    onDestinationNotFound(id: string): void {
        console.warn(`An attempt to handle '${id}' failed as it has not been registered yet`);
    }

    onHandled(id: string): void {
        console.debug(`Handled '${id}'`);
    }

    onRegister(id: string): void {
        console.debug(`Registered '${id}'`);
    }

    onDeregister(id: string): void {
        console.debug(`De-registered '${id}'`);
    }

    onHandlerNotSuccessful(): void {
        console.warn(`Could not handle element`);
    }
}
