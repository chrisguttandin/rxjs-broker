import 'reflect-metadata';
import { ReflectiveInjector } from '@angular/core';
import { WebSocketFactory } from '../../src/web-socket-factory';
import { WebSocketFactoryMock } from '../mock/web-socket-factory';
import { WebSocketObserverFactory } from '../../src/web-socket-observer-factory';

describe('WebSocketObserver', () => {

    var webSocket,
        webSocketObserver;

    beforeEach(() => {
        var injector,
            webSocketFactory,
            webSocketObserverFactory;

        injector = ReflectiveInjector.resolveAndCreate([
            { provide: WebSocketFactory, useClass: WebSocketFactoryMock },
            WebSocketObserverFactory
        ]);

        webSocketFactory = injector.get(WebSocketFactory);
        webSocketObserverFactory = injector.get(WebSocketObserverFactory);

        webSocket = webSocketFactory.create();
        webSocketObserver = webSocketObserverFactory.create({ webSocket });
    });

    describe('next()', () => {

        var value;

        beforeEach(() => value = 'a fake value');

        describe('with a connecting socket', () => {

            beforeEach(() => webSocket.readyState = WebSocket.CONNECTING); // eslint-disable-line no-undef

            it("should wait with sending a given value as message to the socket until it's open", () => {
                webSocketObserver.next(value);

                expect(webSocket.send).to.have.not.been.called;

                webSocket.readyState = WebSocket.OPEN; // eslint-disable-line no-undef
                webSocket.dispatchEvent({ type: 'open' });

                expect(webSocket.send).to.have.been.calledOnce;
                expect(webSocket.send).to.have.been.calledWithExactly(`"${ value }"`);
            });

        });

        describe('with an open socket', () => {

            beforeEach(() => webSocket.readyState = WebSocket.OPEN); // eslint-disable-line no-undef

            it('should send a given value as message to the socket', () => {
                webSocketObserver.next(value);

                expect(webSocket.send).to.have.been.calledOnce;
                expect(webSocket.send).to.have.been.calledWithExactly(`"${ value }"`);
            });

        });

    });

    describe('send()', () => {

        var message;

        beforeEach(() => message = 'a fake message');

        describe('with a connecting socket', () => {

            beforeEach(() => webSocket.readyState = WebSocket.CONNECTING); // eslint-disable-line no-undef

            it("should wait with sending a given message to the socket until it's open", (done) => {
                webSocketObserver
                    .send(message)
                    .then(() => {
                        expect(webSocket.send).to.have.been.calledOnce;
                        expect(webSocket.send).to.have.been.calledWithExactly(`"${ message }"`);

                        done();
                    });

                expect(webSocket.send).to.have.not.been.called;

                webSocket.readyState = WebSocket.OPEN; // eslint-disable-line no-undef
                webSocket.dispatchEvent({ type: 'open' });
            });

        });

        describe('with an open socket', () => {

            beforeEach(() => webSocket.readyState = WebSocket.OPEN); // eslint-disable-line no-undef

            it('should send a given message to the socket', (done) => {
                webSocketObserver
                    .send(message)
                    .then(() => {
                        expect(webSocket.send).to.have.been.calledOnce;
                        expect(webSocket.send).to.have.been.calledWithExactly(`"${ message }"`);

                        done();
                    });
            });

        });

    });

});
