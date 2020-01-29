import { DataChannelMock } from '../../mock/data-channel';
import { TransportObservable } from '../../../src/classes/transport-observable';
import { WebSocketMock } from '../../mock/web-socket';
import { spy } from 'sinon';

describe('TransportObservable', () => {

    let openObserver;

    beforeEach(() => {
        openObserver = { next: spy() };
    });

    for (const transportLayer of [ 'DataChannel', 'WebSocket' ]) {

        let transport;
        let transportObservable;

        beforeEach(() => {
            transport = (transportLayer === 'DataChannel')
                ? new DataChannelMock()
                : new WebSocketMock();
            transportObservable = new TransportObservable(transport, { openObserver });
        });

        describe('subscribe()', () => {

            it('should call next on the given openObserver on an open event', () => {
                const transportSubscription = transportObservable.subscribe();

                transport.dispatchEvent({ type: 'open' });

                expect(openObserver.next).to.have.been.calledOnce;

                transportSubscription.unsubscribe();
            });

            it('should remove the open listener when the subscription is canceled', () => {
                transportObservable
                    .subscribe()
                    .unsubscribe();

                expect(transport.removeEventListener).to.have.been.called;
                expect(transport.removeEventListener).to.have.been.calledWith('open');
            });

            it('should pass on a message event to the subscribed observer', (done) => {
                const message = 'a fake message';
                const transportSubscription = transportObservable
                    .subscribe({
                        next (mssg) {
                            expect(mssg).to.equal(message);

                            transportSubscription.unsubscribe();

                            done();
                        }
                    });

                transport.dispatchEvent({ data: message, type: 'message' });
            });

            it('should remove the message listener when the subscription is canceled', () => {
                transportObservable
                    .subscribe()
                    .unsubscribe();

                expect(transport.removeEventListener).to.have.been.called;
                expect(transport.removeEventListener).to.have.been.calledWith('message');
            });

            it('should pass on an error event to the subscribed observer', (done) => {
                const error = 'a fake error';

                transportObservable
                    .subscribe({
                        error (err) {
                            expect(err).to.equal(error);

                            done();
                        }
                    });

                transport.dispatchEvent({ error, type: 'error' });
            });

            it('should remove the error listener when the subscription is canceled', () => {
                transportObservable
                    .subscribe()
                    .unsubscribe();

                expect(transport.removeEventListener).to.have.been.called;
                expect(transport.removeEventListener).to.have.been.calledWith('error');
            });

            it('should complete the subscribed observer on a close event', (done) => {
                transportObservable
                    .subscribe({
                        complete () {
                            done();
                        }
                    });

                transport.dispatchEvent({ type: 'close' });
            });

            it('should remove the close listener when the subscription is canceled', () => {
                transportObservable
                    .subscribe()
                    .unsubscribe();

                expect(transport.removeEventListener).to.have.been.called;
                expect(transport.removeEventListener).to.have.been.calledWith('close');
            });

        });

    }

});
