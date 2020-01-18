import { DataChannelMock } from '../../mock/data-channel';
import { DataChannelObservable } from '../../../src/classes/data-channel-observable';
import { spy } from 'sinon';

describe('DataChannelObservable', () => {

    let dataChannel;
    let dataChannelObservable;
    let openObserver;

    beforeEach(() => {
        dataChannel = new DataChannelMock();
        openObserver = { next: spy() };
        dataChannelObservable = new DataChannelObservable(dataChannel, { openObserver });
    });

    describe('subscribe()', () => {

        it('should call next on the given openObserver on an open event', () => {
            const dataChannelSubscription = dataChannelObservable.subscribe();

            dataChannel.dispatchEvent({ type: 'open' });

            expect(openObserver.next).to.have.been.calledOnce;

            dataChannelSubscription.unsubscribe();
        });

        it('should remove the open listener when the subscription is canceled', () => {
            dataChannelObservable
                .subscribe()
                .unsubscribe();

            expect(dataChannel.removeEventListener).to.have.been.called;
            expect(dataChannel.removeEventListener).to.have.been.calledWith('open');
        });

        it('should pass on a message event to the subscribed observer', (done) => {
            const message = 'a fake message';
            const dataChannelSubscription = dataChannelObservable
                .subscribe({
                    next (mssg) {
                        expect(mssg).to.equal(message);

                        dataChannelSubscription.unsubscribe();

                        done();
                    }
                });

            dataChannel.dispatchEvent({ data: message, type: 'message' });
        });

        it('should remove the message listener when the subscription is canceled', () => {
            dataChannelObservable
                .subscribe()
                .unsubscribe();

            expect(dataChannel.removeEventListener).to.have.been.called;
            expect(dataChannel.removeEventListener).to.have.been.calledWith('message');
        });

        it('should pass on an error event to the subscribed observer', (done) => {
            const error = 'a fake error';

            dataChannelObservable
                .subscribe({
                    error (err) {
                        expect(err).to.equal(error);

                        done();
                    }
                });

            dataChannel.dispatchEvent({ error, type: 'error' });
        });

        it('should remove the error listener when the subscription is canceled', () => {
            dataChannelObservable
                .subscribe()
                .unsubscribe();

            expect(dataChannel.removeEventListener).to.have.been.called;
            expect(dataChannel.removeEventListener).to.have.been.calledWith('error');
        });

        it('should complete the subscribed observer on a close event', (done) => {
            dataChannelObservable
                .subscribe({
                    complete () {
                        done();
                    }
                });

            dataChannel.dispatchEvent({ type: 'close' });
        });

        it('should remove the close listener when the subscription is canceled', () => {
            dataChannelObservable
                .subscribe()
                .unsubscribe();

            expect(dataChannel.removeEventListener).to.have.been.called;
            expect(dataChannel.removeEventListener).to.have.been.calledWith('close');
        });

    });

});
