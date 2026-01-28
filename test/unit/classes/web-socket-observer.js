import { beforeEach, describe, expect, it } from 'vitest';
import { WebSocketMock } from '../../mock/web-socket';
import { WebSocketObserver } from '../../../src/classes/web-socket-observer';

describe('WebSocketObserver', () => {
    let webSocket;
    let webSocketObserver;

    beforeEach(() => {
        webSocket = new WebSocketMock();
        webSocketObserver = new WebSocketObserver(webSocket);
    });

    describe('next()', () => {
        let value;

        beforeEach(() => (value = 'a fake value'));

        describe('with a connecting socket', () => {
            beforeEach(() => (webSocket.readyState = WebSocket.CONNECTING));

            it("should wait with sending a given value as message to the socket until it's open", () => {
                webSocketObserver.next(value);

                expect(webSocket.send).to.have.not.been.called;

                webSocket.readyState = WebSocket.OPEN;
                webSocket.dispatchEvent({ type: 'open' });

                expect(webSocket.send).to.have.been.calledOnce;
                expect(webSocket.send).to.have.been.calledWithExactly(`"${value}"`);
            });

            it('should give up sending a given value as message to the socket if there is an error', () => {
                webSocketObserver.next(value);

                expect(webSocket.send).to.have.not.been.called;

                webSocket.dispatchEvent({ type: 'error' });

                expect(webSocket.send).to.have.not.been.called;
            });
        });

        describe('with an open socket', () => {
            beforeEach(() => (webSocket.readyState = WebSocket.OPEN));

            it('should send a given value as message to the socket', () => {
                webSocketObserver.next(value);

                expect(webSocket.send).to.have.been.calledOnce;
                expect(webSocket.send).to.have.been.calledWithExactly(`"${value}"`);
            });
        });

        describe('with an closing socket', () => {
            beforeEach(() => (webSocket.readyState = WebSocket.CLOSING));

            it('should not send the given message to the socket', () => {
                webSocketObserver.next(value);

                expect(webSocket.send).to.have.not.been.called;
            });
        });

        describe('with an closed socket', () => {
            beforeEach(() => (webSocket.readyState = WebSocket.CLOSED));

            it('should not send the given message to the socket', () => {
                webSocketObserver.next(value);

                expect(webSocket.send).to.have.not.been.called;
            });
        });
    });

    describe('send()', () => {
        let message;

        beforeEach(() => (message = 'a fake message'));

        describe('with a connecting socket', () => {
            beforeEach(() => (webSocket.readyState = WebSocket.CONNECTING));

            it("should wait with sending a given message to the socket until it's open", () => {
                const { promise, resolve } = Promise.withResolvers();

                webSocketObserver.send(message).then(() => {
                    expect(webSocket.send).to.have.been.calledOnce;
                    expect(webSocket.send).to.have.been.calledWithExactly(`"${message}"`);

                    resolve();
                });

                expect(webSocket.send).to.have.not.been.called;

                webSocket.readyState = WebSocket.OPEN;
                webSocket.dispatchEvent({ type: 'open' });

                return promise;
            });

            it('should give up sending a given message to the socket if there is an error', () => {
                const { promise, resolve } = Promise.withResolvers();

                webSocketObserver.send(message).catch((err) => {
                    expect(err.message).to.equal('Unknown WebSocket Error');

                    expect(webSocket.send).to.have.not.been.called;

                    resolve();
                });

                expect(webSocket.send).to.have.not.been.called;

                webSocket.dispatchEvent({ type: 'error' });

                return promise;
            });
        });

        describe('with an open socket', () => {
            beforeEach(() => (webSocket.readyState = WebSocket.OPEN));

            it('should send a given message to the socket', () => {
                const { promise, resolve } = Promise.withResolvers();

                webSocketObserver.send(message).then(() => {
                    expect(webSocket.send).to.have.been.calledOnce;
                    expect(webSocket.send).to.have.been.calledWithExactly(`"${message}"`);

                    resolve();
                });

                return promise;
            });
        });

        describe('with an closing socket', () => {
            beforeEach(() => (webSocket.readyState = WebSocket.CLOSING));

            it('should not send the given message to the socket', () => {
                const { promise, resolve } = Promise.withResolvers();

                webSocketObserver.send(message).catch((err) => {
                    expect(err.message).to.equal('The WebSocket is already closing.');

                    expect(webSocket.send).to.have.not.been.called;

                    resolve();
                });

                return promise;
            });
        });

        describe('with an closed socket', () => {
            beforeEach(() => (webSocket.readyState = WebSocket.CLOSED));

            it('should not send the given message to the socket', () => {
                const { promise, resolve } = Promise.withResolvers();

                webSocketObserver.send(message).catch((err) => {
                    expect(err.message).to.equal('The WebSocket is already closed.');

                    expect(webSocket.send).to.have.not.been.called;

                    resolve();
                });

                return promise;
            });
        });
    });
});
