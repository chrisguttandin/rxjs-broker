import { DataChannelMock } from '../../mock/data-channel';
import { DataChannelSubject } from '../../../src/classes/data-channel-subject';
import { createDataChannelObservable } from '../../../src/factories/data-channel-observable';
import { createDataChannelObserver } from '../../../src/factories/data-channel-observer';
import { createMaskedSubject } from '../../../src/factories/masked-subject';
import { filter } from 'rxjs/operators';

describe('DataChannelSubject', () => {

    let dataChannel;
    let dataChannelSubject;

    beforeEach(() => {
        dataChannel = new DataChannelMock();
        dataChannelSubject = new DataChannelSubject(
            createDataChannelObservable,
            createDataChannelObserver,
            createMaskedSubject,
            dataChannel
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

    describe('mask()', () => {

        let message;

        beforeEach(() => {
            message = { a: 'fake message' };

            dataChannelSubject = dataChannelSubject.mask({ a: { fake: 'mask' } });
        });

        it('should augment messages with the mask when calling next()', () => {
            dataChannel.readyState = 'open';

            dataChannelSubject.next(message);

            expect(dataChannel.send).to.have.been.calledOnce;
            expect(dataChannel.send).to.have.been.calledWithExactly('{"a":{"fake":"mask"},"message":{"a":"fake message"}}');
        });

        it('should augment messages with the mask when calling send()', (done) => {
            dataChannel.readyState = 'open';

            dataChannelSubject
                .send(message)
                .then(() => {
                    expect(dataChannel.send).to.have.been.calledOnce;
                    expect(dataChannel.send).to.have.been.calledWithExactly('{"a":{"fake":"mask"},"message":{"a":"fake message"}}');

                    done();
                });
        });

        it('should filter messages by the mask', (done) => {
            const dataChannelSubscription = dataChannelSubject
                .subscribe({
                    next (mssg) {
                        expect(mssg).to.equal(message);

                        dataChannelSubscription.unsubscribe();

                        done();
                    }
                });

            dataChannel.dispatchEvent({ data: { a: { fake: 'mask' }, message }, type: 'message' });
        });

    });

    describe('subscribe()', () => {

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
