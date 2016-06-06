import 'reflect-metadata';
import { DataChannelMock } from '../mock/data-channel';
import { DataChannelObservableFactory } from '../../src/data-channel-observable-factory';
import { DataChannelObserverFactory } from '../../src/data-channel-observer-factory';
import { DataChannelSubjectFactory } from '../../src/data-channel-subject-factory';
import { ReflectiveInjector } from '@angular/core';
import { filter } from 'rxjs/operator/filter';

describe('DataChannelSubject', () => {

    var dataChannel,
        dataChannelSubject;

    beforeEach(() => {
        var dataChannelSubjectFactory,
            injector;

        injector = ReflectiveInjector.resolveAndCreate([
            DataChannelObservableFactory,
            DataChannelObserverFactory,
            DataChannelSubjectFactory
        ]);

        dataChannelSubjectFactory = injector.get(DataChannelSubjectFactory);

        dataChannel = new DataChannelMock();
        dataChannelSubject = dataChannelSubjectFactory.create({ dataChannel });
    });

    it('should allow to be used with other operators', (done) => {
        var dataChannelSubscription,
            message;

        message = 'a fake message';
        dataChannelSubscription = dataChannelSubject
            ::filter(() => true)
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

        var message;

        beforeEach(() => {
            message = { a: 'fake message' };

            dataChannelSubject = dataChannelSubject.mask({ a: { fake: 'mask' } });
        });

        it('should augment messages with the mask when calling next()', () => {
            dataChannel.readyState = 'open';

            dataChannelSubject.next(message);

            expect(dataChannel.send).to.have.been.calledOnce;
            expect(dataChannel.send).to.have.been.calledWithExactly('{"a":{"fake":"mask"},"message":{"a":"fake message"}}');
        });

        it('should augment messages with the mask when calling send()', async () => {
            dataChannel.readyState = 'open';

            await dataChannelSubject.send(message);

            expect(dataChannel.send).to.have.been.calledOnce;
            expect(dataChannel.send).to.have.been.calledWithExactly('{"a":{"fake":"mask"},"message":{"a":"fake message"}}');
        });

        it('should filter messages by the mask', (done) => {
            var dataChannelSubscription,
                message;

            dataChannelSubscription = dataChannelSubject
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
            var dataChannelSubscription,
                message;

            message = 'a fake message';
            dataChannelSubscription = dataChannelSubject
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
            var error = 'a fake error';

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
