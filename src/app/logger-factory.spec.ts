/* tslint:disable:no-unused-variable */
import { LoggerFactory } from './logger-factory';

describe('LoggerFactory', () => {
    class MockConsole {
        error(message?: any, ...optional: any[]): void { }
        log(message?: any, ...optional: any[]): void { }
        warn(message?: any, ...optional: any[]): void { }
        info(message?: any, ...optional: any[]): void { }
    }

    it('should return user-injected logger if config logger not set.', () => {
        let user = new MockConsole();
        let config = { logger: undefined };
        let logger = LoggerFactory(config, user);
        expect(logger).toBe(user);
    });
    it('should warn and return deprecated config logger when user null.', () => {
        let user = null;
        let config = { logger: new MockConsole() };
        let warned: boolean = false;
        config.logger.warn = function(msg) { warned = msg; };
        let logger = LoggerFactory(config, user);
        expect(logger).toBe(config.logger);
        expect(warned).toBeTruthy();
    });
});