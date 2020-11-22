import { Logger } from '../../domain/Logger';

export class DebugLogger implements Logger {
    onDestinationNotFound(id: string): void {
        console.warn(`An attempt to scroll to '${id}' failed as it has not been registered yet`);
    }

    onScroll(id: string): void {
        console.debug(`Scrolled to '${id}'`);
    }

    onRegister(id: string): void {
        console.debug(`Registered '${id}'`);
    }

    onDeregister(id: string): void {
        console.debug(`De-registered '${id}'`);
    }

    onScrollerNotSuccessful(): void {
        console.warn(`Could not scroll as no scrollers were successful`);
    }
}
