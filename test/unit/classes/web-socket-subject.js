import { WebSocketMock } from '../../mock/web-socket';
import { WebSocketSubject } from '../../../src/classes/web-socket-subject';
import { createMaskedWebSocketSubject } from '../../../src/factories/masked-web-socket-subject';
import { createWebSocketObservable } from '../../../src/factories/web-socket-observable';
import { createWebSocketObserver } from '../../../src/factories/web-socket-observer';
import { filter } from 'rxjs/operators';

describe('WebSocketSubject', () => {

    let webSocket;
    let webSocketSubject;

    beforeEach(() => {
        webSocket = new WebSocketMock();
        webSocketSubject = new WebSocketSubject(
            createWebSocketObservable,
            createWebSocketObserver,
            createMaskedWebSocketSubject,
            webSocket
        );
    });

    it('should allow to be used with other operators', (done) => {
        const message = 'a fake message';
        const webSocketSubscription = webSocketSubject
            .pipe(filter(() => true))
            .subscribe({
                next (mssg) {
                    expect(mssg).to.equal(message);

                    webSocketSubscription.unsubscribe();

                    done();
                }
            });

        webSocket.dispatchEvent({ data: message, type: 'message' });
    });

    describe('close()', () => {

        it('should close the socket', () => {
            webSocketSubject.close();

            expect(webSocket.close).to.have.been.calledOnce;
            expect(webSocket.close).to.have.been.calledWithExactly();
        });

    });

    describe('mask()', () => {

        let message;

        beforeEach(() => {
            message = { a: 'fake message' };

            webSocketSubject = webSocketSubject.mask({ a: { fake: 'mask' } });
        });

        it('should augment messages with the mask when calling next()', () => {
            webSocket.readyState = WebSocket.OPEN;

            webSocketSubject.next(message);

            expect(webSocket.send).to.have.been.calledOnce;
            expect(webSocket.send).to.have.been.calledWithExactly('{"a":{"fake":"mask"},"message":{"a":"fake message"}}');
        });

        it('should augment messages with the mask when calling send()', (done) => {
            webSocket.readyState = WebSocket.OPEN;

            webSocketSubject
                .send(message)
                .then(() => {
                    expect(webSocket.send).to.have.been.calledOnce;
                    expect(webSocket.send).to.have.been.calledWithExactly('{"a":{"fake":"mask"},"message":{"a":"fake message"}}');

                    done();
                });
        });

        it('should filter messages by the mask', (done) => {
            const webSocketSubscription = webSocketSubject
                .subscribe({
                    next (mssg) {
                        expect(mssg).to.equal(message);

                        webSocketSubscription.unsubscribe();

                        done();
                    }
                });

            webSocket.dispatchEvent({ data: { a: { fake: 'mask' }, message }, type: 'message' });
        });

    });

    describe('subscribe()', () => {

        it('should emit a message from the socket', (done) => {
            const message = 'a fake message';
            const webSocketSubscription = webSocketSubject
                .subscribe({
                    next (mssg) {
                        expect(mssg).to.equal(message);

                        webSocketSubscription.unsubscribe();

                        done();
                    }
                });

            webSocket.dispatchEvent({ data: message, type: 'message' });
        });

        it('should emit an error from the socket', (done) => {
            const error = 'a fake error';

            webSocketSubject
                .subscribe({
                    error (err) {
                        expect(err).to.equal(error);

                        done();
                    }
                });

            webSocket.dispatchEvent({ error, type: 'error' });
        });

        it('should complete when the socket gets closed', (done) => {
            webSocketSubject
                .subscribe({
                    complete () {
                        done();
                    }
                });

            webSocket.dispatchEvent({ type: 'close' });
        });

    });

});
