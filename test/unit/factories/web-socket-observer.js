import 'core-js/es7/reflect';
import { WebSocketFactory, WebSocketObserverFactory } from '../../../src/factories';
import { ReflectiveInjector } from '@angular/core';
import { WebSocketFactoryMock } from '../../mock/web-socket-factory';

describe('WebSocketObserver', () => {

    let webSocket;

    let webSocketObserver;

    beforeEach(() => {
        const injector = ReflectiveInjector.resolveAndCreate([
            { provide: WebSocketFactory, useClass: WebSocketFactoryMock },
            WebSocketObserverFactory
        ]);

        const webSocketFactory = injector.get(WebSocketFactory);

        const webSocketObserverFactory = injector.get(WebSocketObserverFactory);

        webSocket = webSocketFactory.create();
        webSocketObserver = webSocketObserverFactory.create({ webSocket });
    });

    describe('next()', () => {

        let value;

        beforeEach(() => value = 'a fake value');

        describe('with a connecting socket', () => {

            beforeEach(() => webSocket.readyState = WebSocket.CONNECTING);

            it("should wait with sending a given value as message to the socket until it's open", () => {
                webSocketObserver.next(value);

                expect(webSocket.send).to.have.not.been.called;

                webSocket.readyState = WebSocket.OPEN;
                webSocket.dispatchEvent({ type: 'open' });

                expect(webSocket.send).to.have.been.calledOnce;
                expect(webSocket.send).to.have.been.calledWithExactly(`"${ value }"`);
            });

        });

        describe('with an open socket', () => {

            beforeEach(() => webSocket.readyState = WebSocket.OPEN);

            it('should send a given value as message to the socket', () => {
                webSocketObserver.next(value);

                expect(webSocket.send).to.have.been.calledOnce;
                expect(webSocket.send).to.have.been.calledWithExactly(`"${ value }"`);
            });

        });

    });

    describe('send()', () => {

        let message;

        beforeEach(() => message = 'a fake message');

        describe('with a connecting socket', () => {

            beforeEach(() => webSocket.readyState = WebSocket.CONNECTING);

            it("should wait with sending a given message to the socket until it's open", (done) => {
                webSocketObserver
                    .send(message)
                    .then(() => {
                        expect(webSocket.send).to.have.been.calledOnce;
                        expect(webSocket.send).to.have.been.calledWithExactly(`"${ message }"`);

                        done();
                    });

                expect(webSocket.send).to.have.not.been.called;

                webSocket.readyState = WebSocket.OPEN;
                webSocket.dispatchEvent({ type: 'open' });
            });

        });

        describe('with an open socket', () => {

            beforeEach(() => webSocket.readyState = WebSocket.OPEN);

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
