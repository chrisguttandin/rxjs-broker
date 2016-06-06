import 'reflect-metadata';
import { ReflectiveInjector } from '@angular/core';
import { WebSocketFactory } from '../../src/web-socket-factory';
import { WebSocketFactoryMock } from '../mock/web-socket-factory';
import { WebSocketObservableFactory } from '../../src/web-socket-observable-factory';
import { WebSocketObserverFactory } from '../../src/web-socket-observer-factory';
import { WebSocketSubjectFactory } from '../../src/web-socket-subject-factory';

describe('WebSocketSubject', () => {

    var webSocket,
        webSocketSubject;

    beforeEach(() => {
        var injector,
            webSocketFactory,
            webSocketSubjectFactory;

        injector = ReflectiveInjector.resolveAndCreate([
            { provide: WebSocketFactory, useClass: WebSocketFactoryMock },
            WebSocketObservableFactory,
            WebSocketObserverFactory,
            WebSocketSubjectFactory
        ]);

        webSocketFactory = injector.get(WebSocketFactory);
        webSocketSubjectFactory = injector.get(WebSocketSubjectFactory);

        webSocket = webSocketFactory.create();
        webSocketSubject = webSocketSubjectFactory.create({ webSocket });
    });

    describe('close()', () => {

        it('should close the socket', () => {
            webSocketSubject.close();

            expect(webSocket.close).to.have.been.calledOnce;
            expect(webSocket.close).to.have.been.calledWithExactly();
        });

    });

    describe('mask()', () => {

        var message;

        beforeEach(() => {
            message = { a: 'fake message' };

            webSocketSubject = webSocketSubject.mask({ a: { fake: 'mask' } });
        });

        it('should augment messages with the mask when calling next()', () => {
            webSocket.readyState = WebSocket.OPEN; // eslint-disable-line no-undef

            webSocketSubject.next(message);

            expect(webSocket.send).to.have.been.calledOnce;
            expect(webSocket.send).to.have.been.calledWithExactly('{"a":{"fake":"mask"},"message":{"a":"fake message"}}');
        });

        it('should augment messages with the mask when calling send()', async () => {
            webSocket.readyState = WebSocket.OPEN; // eslint-disable-line no-undef

            await webSocketSubject.send(message);

            expect(webSocket.send).to.have.been.calledOnce;
            expect(webSocket.send).to.have.been.calledWithExactly('{"a":{"fake":"mask"},"message":{"a":"fake message"}}');
        });

        it('should filter messages by the mask', (done) => {
            var message,
                webSocketSubscription;

            webSocketSubscription = webSocketSubject
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
            var message,
                webSocketSubscription;

            message = 'a fake message';
            webSocketSubscription = webSocketSubject
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
            var error = 'a fake error';

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
