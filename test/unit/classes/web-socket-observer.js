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
        });

        describe('with an open socket', () => {
            beforeEach(() => (webSocket.readyState = WebSocket.OPEN));

            it('should send a given value as message to the socket', () => {
                webSocketObserver.next(value);

                expect(webSocket.send).to.have.been.calledOnce;
                expect(webSocket.send).to.have.been.calledWithExactly(`"${value}"`);
            });
        });
    });

    describe('send()', () => {
        let message;

        beforeEach(() => (message = 'a fake message'));

        describe('with a connecting socket', () => {
            beforeEach(() => (webSocket.readyState = WebSocket.CONNECTING));

            it("should wait with sending a given message to the socket until it's open", (done) => {
                webSocketObserver.send(message).then(() => {
                    expect(webSocket.send).to.have.been.calledOnce;
                    expect(webSocket.send).to.have.been.calledWithExactly(`"${message}"`);

                    done();
                });

                expect(webSocket.send).to.have.not.been.called;

                webSocket.readyState = WebSocket.OPEN;
                webSocket.dispatchEvent({ type: 'open' });
            });
        });

        describe('with an open socket', () => {
            beforeEach(() => (webSocket.readyState = WebSocket.OPEN));

            it('should send a given message to the socket', (done) => {
                webSocketObserver.send(message).then(() => {
                    expect(webSocket.send).to.have.been.calledOnce;
                    expect(webSocket.send).to.have.been.calledWithExactly(`"${message}"`);

                    done();
                });
            });
        });
    });
});
