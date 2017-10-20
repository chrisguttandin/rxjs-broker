import 'core-js/es7/reflect';
import { MaskedWebSocketSubjectFactory } from '../../../src/factories/masked-web-socket-subject';
import { ReflectiveInjector } from '@angular/core';
import { WebSocketFactory } from '../../../src/factories/web-socket';
import { WebSocketFactoryMock } from '../../mock/web-socket-factory';
import { WebSocketObservableFactory } from '../../../src/factories/web-socket-observable';
import { WebSocketObserverFactory } from '../../../src/factories/web-socket-observer';
import { WebSocketSubjectFactory } from '../../../src/factories/web-socket-subject';
import { filter } from 'rxjs/operators';

describe('WebSocketSubject', () => {

    let webSocket;
    let webSocketSubject;

    beforeEach(() => {
        const injector = ReflectiveInjector.resolveAndCreate([
            MaskedWebSocketSubjectFactory,
            { provide: WebSocketFactory, useClass: WebSocketFactoryMock },
            WebSocketObservableFactory,
            WebSocketObserverFactory,
            WebSocketSubjectFactory
        ]);
        const webSocketFactory = injector.get(WebSocketFactory);
        const webSocketSubjectFactory = injector.get(WebSocketSubjectFactory);

        webSocket = webSocketFactory.create();
        webSocketSubject = webSocketSubjectFactory.create({ webSocket });
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
