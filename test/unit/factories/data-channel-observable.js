import 'core-js/es7/reflect';
import { DataChannelMock } from '../../mock/data-channel';
import { DataChannelObservableFactory } from '../../../src/factories';
import { Observable } from 'rxjs';
import { ReflectiveInjector } from '@angular/core';

describe('DataChannelObservableFactory', () => {

    let dataChannelObservableFactory;

    beforeEach(() => {
        const injector = ReflectiveInjector.resolveAndCreate([
            DataChannelObservableFactory
        ]);

        dataChannelObservableFactory = injector.get(DataChannelObservableFactory);
    });

    describe('create()', () => {

        it('should return an Observable', () => {
            expect(dataChannelObservableFactory.create({})).to.be.an.instanceOf(Observable);
        });

    });

});

describe('DataChannelObservable', () => {

    let dataChannel;

    let dataChannelObservable;

    beforeEach(() => {
        const injector = ReflectiveInjector.resolveAndCreate([
            DataChannelObservableFactory
        ]);

        const dataChannelObservableFactory = injector.get(DataChannelObservableFactory);

        dataChannel = new DataChannelMock();
        dataChannelObservable = dataChannelObservableFactory.create({ dataChannel });
    });

    describe('subscribe()', () => {

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
