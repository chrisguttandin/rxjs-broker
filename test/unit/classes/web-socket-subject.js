import { beforeEach, describe, expect, it } from 'vitest';
import { WebSocketMock } from '../../mock/web-socket';
import { WebSocketSubject } from '../../../src/classes/web-socket-subject';
import { createTransportObservable } from '../../../src/factories/transport-observable';
import { createWebSocketObserver } from '../../../src/factories/web-socket-observer';
import { filter } from 'rxjs/operators';
import { spy } from 'sinon';

describe('WebSocketSubject', () => {
    let openObserver;
    let webSocket;
    let webSocketSubject;

    beforeEach(() => {
        openObserver = { next: spy() };
        webSocket = new WebSocketMock();
        webSocketSubject = new WebSocketSubject(createTransportObservable, createWebSocketObserver, webSocket, { openObserver });
    });

    it('should allow to be used with other operators', () => {
        const { promise, resolve } = Promise.withResolvers();
        const message = 'a fake message';
        const webSocketSubscription = webSocketSubject.pipe(filter(() => true)).subscribe({
            next(mssg) {
                expect(mssg).to.equal(message);

                webSocketSubscription.unsubscribe();

                resolve();
            }
        });

        webSocket.dispatchEvent({ data: message, type: 'message' });

        return promise;
    });

    describe('close()', () => {
        it('should close the socket', () => {
            webSocketSubject.close();

            expect(webSocket.close).to.have.been.calledOnce;
            expect(webSocket.close).to.have.been.calledWithExactly();
        });
    });

    describe('subscribe()', () => {
        it('should call next on the given openObserver when the socket is open', () => {
            const webSocketSubscription = webSocketSubject.subscribe();

            webSocket.dispatchEvent({ type: 'open' });

            expect(openObserver.next).to.have.been.calledOnce;

            webSocketSubscription.unsubscribe();
        });

        it('should emit a message from the socket', () => {
            const { promise, resolve } = Promise.withResolvers();
            const message = 'a fake message';
            const webSocketSubscription = webSocketSubject.subscribe({
                next(mssg) {
                    expect(mssg).to.equal(message);

                    webSocketSubscription.unsubscribe();

                    resolve();
                }
            });

            webSocket.dispatchEvent({ data: message, type: 'message' });

            return promise;
        });

        it('should emit an error from the socket', () => {
            const { promise, resolve } = Promise.withResolvers();
            const error = 'a fake error';

            webSocketSubject.subscribe({
                error(err) {
                    expect(err).to.equal(error);

                    resolve();
                }
            });

            webSocket.dispatchEvent({ error, type: 'error' });

            return promise;
        });

        it('should complete when the socket gets closed', () => {
            const { promise, resolve } = Promise.withResolvers();

            webSocketSubject.subscribe({
                complete() {
                    resolve();
                }
            });

            webSocket.dispatchEvent({ type: 'close' });

            return promise;
        });
    });
});
