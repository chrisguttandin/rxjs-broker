import { DataChannelMock } from '../../mock/data-channel';
import { DataChannelSubject } from '../../../src/classes/data-channel-subject';
import { MaskedSubject } from '../../../src/classes/masked-subject';
import { WebSocketMock } from '../../mock/web-socket';
import { WebSocketSubject } from '../../../src/classes/web-socket-subject';
import { createDataChannelObservable } from '../../../src/factories/data-channel-observable';
import { createDataChannelObserver } from '../../../src/factories/data-channel-observer';
import { createWebSocketObservable } from '../../../src/factories/web-socket-observable';
import { createWebSocketObserver } from '../../../src/factories/web-socket-observer';
import { getTypedKeys } from '../../../src/functions/get-typed-keys';

describe('MaskedSubject', () => {

    for (const transportLayer of [ 'DataChannel', 'WebSocket' ]) {

        describe(`with a ${ transportLayer }Subject`, () => {

            let dataChannelOrWebSocket;
            let message;
            let maskedSubject;

            beforeEach(() => {
                dataChannelOrWebSocket = (transportLayer === 'DataChannel')
                    ? new DataChannelMock()
                    : new WebSocketMock();
                message = { a: 'fake message' };
                maskedSubject = new MaskedSubject(
                    getTypedKeys,
                    { a: { fake: 'mask' } },
                    (transportLayer === 'DataChannel')
                        ? new DataChannelSubject(
                            createDataChannelObservable,
                            createDataChannelObserver,
                            dataChannelOrWebSocket,
                            { }
                        )
                        : new WebSocketSubject(
                            createWebSocketObservable,
                            createWebSocketObserver,
                            dataChannelOrWebSocket,
                            { }
                        )
                );
            });

            it('should augment messages with the mask when calling next()', () => {
                dataChannelOrWebSocket.readyState = (transportLayer === 'DataChannel') ? 'open' : WebSocket.OPEN;

                maskedSubject.next(message);

                expect(dataChannelOrWebSocket.send).to.have.been.calledOnce;
                expect(dataChannelOrWebSocket.send).to.have.been.calledWithExactly('{"a":{"fake":"mask"},"message":{"a":"fake message"}}');
            });

            it('should augment messages with the mask when calling send()', (done) => {
                dataChannelOrWebSocket.readyState = (transportLayer === 'DataChannel') ? 'open' : WebSocket.OPEN;

                maskedSubject
                    .send(message)
                    .then(() => {
                        expect(dataChannelOrWebSocket.send).to.have.been.calledOnce;
                        expect(dataChannelOrWebSocket.send).to.have.been.calledWithExactly('{"a":{"fake":"mask"},"message":{"a":"fake message"}}');

                        done();
                    });
            });

            it('should filter messages by the mask', (done) => {
                const subscription = maskedSubject
                    .subscribe({
                        next (mssg) {
                            expect(mssg).to.equal(message);

                            subscription.unsubscribe();

                            done();
                        }
                    });

                dataChannelOrWebSocket.dispatchEvent({ data: { a: { fake: 'mask' }, message }, type: 'message' });
            });

        });

    }

});
