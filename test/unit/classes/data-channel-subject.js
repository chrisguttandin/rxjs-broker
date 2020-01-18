import { DataChannelMock } from '../../mock/data-channel';
import { DataChannelSubject } from '../../../src/classes/data-channel-subject';
import { createDataChannelObserver } from '../../../src/factories/data-channel-observer';
import { createTransportObservable } from '../../../src/factories/transport-observable';
import { filter } from 'rxjs/operators';
import { spy } from 'sinon';

describe('DataChannelSubject', () => {

    let dataChannel;
    let dataChannelSubject;
    let openObserver;

    beforeEach(() => {
        openObserver = { next: spy() };
        dataChannel = new DataChannelMock();
        dataChannelSubject = new DataChannelSubject(
            createDataChannelObserver,
            createTransportObservable,
            dataChannel,
            { openObserver }
        );
    });

    it('should allow to be used with other operators', (done) => {
        const message = 'a fake message';
        const dataChannelSubscription = dataChannelSubject
            .pipe(filter(() => true))
            .subscribe({
                next (mssg) {
                    expect(mssg).to.equal(message);

                    dataChannelSubscription.unsubscribe();

                    done();
                }
            });

        dataChannel.dispatchEvent({ data: message, type: 'message' });
    });

    describe('close()', () => {

        it('should close the data channel', () => {
            dataChannelSubject.close();

            expect(dataChannel.close).to.have.been.calledOnce;
            expect(dataChannel.close).to.have.been.calledWithExactly();
        });

    });

    describe('subscribe()', () => {

        it('should call next on the given openObserver when the data channel is open', () => {
            const dataChannelSubscription = dataChannelSubject.subscribe();

            dataChannel.dispatchEvent({ type: 'open' });

            expect(openObserver.next).to.have.been.calledOnce;

            dataChannelSubscription.unsubscribe();
        });

        it('should emit a message from the data channel', (done) => {
            const message = 'a fake message';
            const dataChannelSubscription = dataChannelSubject
                .subscribe({
                    next (mssg) {
                        expect(mssg).to.equal(message);

                        dataChannelSubscription.unsubscribe();

                        done();
                    }
                });

            dataChannel.dispatchEvent({ data: message, type: 'message' });
        });

        it('should emit an error from the data channel', (done) => {
            const error = 'a fake error';

            dataChannelSubject
                .subscribe({
                    error (err) {
                        expect(err).to.equal(error);

                        done();
                    }
                });

            dataChannel.dispatchEvent({ error, type: 'error' });
        });

        it('should complete when the data channel gets closed', (done) => {
            dataChannelSubject
                .subscribe({
                    complete () {
                        done();
                    }
                });

            dataChannel.dispatchEvent({ type: 'close' });
        });

    });

});
