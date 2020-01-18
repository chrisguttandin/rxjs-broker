import { WebSocketMock } from '../../mock/web-socket';
import { WebSocketObservable } from '../../../src/classes/web-socket-observable';
import { spy } from 'sinon';

describe('WebSocketObservable', () => {

    let openObserver;
    let webSocket;
    let webSocketObservable;

    beforeEach(() => {
        openObserver = { next: spy() };
        webSocket = new WebSocketMock();
        webSocketObservable = new WebSocketObservable(webSocket, { openObserver });
    });

    describe('subscribe()', () => {

        it('should call next on the given openObserver on an open event', () => {
            const webSocketSubscription = webSocketObservable.subscribe();

            webSocket.dispatchEvent({ type: 'open' });

            expect(openObserver.next).to.have.been.calledOnce;

            webSocketSubscription.unsubscribe();
        });

        it('should remove the open listener when the subscription is canceled', () => {
            webSocketObservable
                .subscribe()
                .unsubscribe();

            expect(webSocket.removeEventListener).to.have.been.called;
            expect(webSocket.removeEventListener).to.have.been.calledWith('open');
        });

        it('should pass on a message event to the subscribed observer', (done) => {
            const message = 'a fake message';
            const webSocketSubscription = webSocketObservable
                .subscribe({
                    next (mssg) {
                        expect(mssg).to.equal(message);

                        webSocketSubscription.unsubscribe();

                        done();
                    }
                });

            webSocket.dispatchEvent({ data: message, type: 'message' });
        });

        it('should remove the message listener when the subscription is canceled', () => {
            webSocketObservable
                .subscribe()
                .unsubscribe();

            expect(webSocket.removeEventListener).to.have.been.called;
            expect(webSocket.removeEventListener).to.have.been.calledWith('message');
        });

        it('should pass on an error event to the subscribed observer', (done) => {
            const error = 'a fake error';

            webSocketObservable
                .subscribe({
                    error (err) {
                        expect(err).to.equal(error);

                        done();
                    }
                });

            webSocket.dispatchEvent({ error, type: 'error' });
        });

        it('should remove the error listener when the subscription is canceled', () => {
            webSocketObservable
                .subscribe()
                .unsubscribe();

            expect(webSocket.removeEventListener).to.have.been.called;
            expect(webSocket.removeEventListener).to.have.been.calledWith('error');
        });

        it('should complete the subscribed observer on a close event', (done) => {
            webSocketObservable
                .subscribe({
                    complete () {
                        done();
                    }
                });

            webSocket.dispatchEvent({ type: 'close' });
        });

        it('should remove the close listener when the subscription is canceled', () => {
            webSocketObservable
                .subscribe()
                .unsubscribe();

            expect(webSocket.removeEventListener).to.have.been.called;
            expect(webSocket.removeEventListener).to.have.been.calledWith('close');
        });

    });

});
