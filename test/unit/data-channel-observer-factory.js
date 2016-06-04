import 'reflect-metadata';
import { DataChannelMock } from '../mock/data-channel';
import { DataChannelObserverFactory } from '../../src/data-channel-observer-factory';
import { ReflectiveInjector } from '@angular/core';

describe('DataChannelObserver', () => {

    var dataChannel,
        dataChannelObserver;

    beforeEach(() => {
        var dataChannelObserverFactory,
            injector;

        injector = ReflectiveInjector.resolveAndCreate([
            DataChannelObserverFactory
        ]);

        dataChannelObserverFactory = injector.get(DataChannelObserverFactory);

        dataChannel = new DataChannelMock();
        dataChannelObserver = dataChannelObserverFactory.create({ dataChannel });
    });

    describe('next()', () => {

        it('should send a given value as message to the data channel', () => {
            var value = 'a fake value';

            dataChannel.readyState = 'open';

            dataChannelObserver.next(value);

            expect(dataChannel.send).to.have.been.calledOnce;
            expect(dataChannel.send).to.have.been.calledWithExactly(`"${ value }"`);
        });

    });

    describe('send()', () => {

        describe('with a connecting data channel', () => {

            beforeEach(() => dataChannel.readyState = 'connecting');

            it("should wait with sending a given message to the data channel until it's open", () => {
                var message = 'a fake message';

                dataChannelObserver.next(message);

                expect(dataChannel.send).to.have.not.been.called;

                dataChannel.dispatchEvent({ type: 'open' });

                expect(dataChannel.send).to.have.been.calledOnce;
                expect(dataChannel.send).to.have.been.calledWithExactly(`"${ message }"`);
            });

        });

        describe('with an open data channel', () => {

            beforeEach(() => dataChannel.readyState = 'open');

            it('should send a given message to the data channel', () => {
                var message = 'a fake message';

                dataChannelObserver.next(message);

                expect(dataChannel.send).to.have.been.calledOnce;
                expect(dataChannel.send).to.have.been.calledWithExactly(`"${ message }"`);
            });

        });

    });

});
