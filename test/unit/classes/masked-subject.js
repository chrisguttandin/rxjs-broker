import { beforeEach, describe, expect, it } from 'vitest';
import { DataChannelMock } from '../../mock/data-channel';
import { DataChannelSubject } from '../../../src/classes/data-channel-subject';
import { MaskedSubject } from '../../../src/classes/masked-subject';
import { WebSocketMock } from '../../mock/web-socket';
import { WebSocketSubject } from '../../../src/classes/web-socket-subject';
import { createDataChannelObserver } from '../../../src/factories/data-channel-observer';
import { createTransportObservable } from '../../../src/factories/transport-observable';
import { createWebSocketObserver } from '../../../src/factories/web-socket-observer';
import { getTypedKeys } from '../../../src/functions/get-typed-keys';

describe('MaskedSubject', () => {
    for (const transportLayer of ['DataChannel', 'WebSocket']) {
        describe(`with a ${transportLayer}Subject`, () => {
            let dataChannelOrWebSocket;
            let message;
            let maskedSubject;

            beforeEach(() => {
                dataChannelOrWebSocket = transportLayer === 'DataChannel' ? new DataChannelMock() : new WebSocketMock();
                message = { a: 'fake message' };
                maskedSubject = new MaskedSubject(
                    getTypedKeys,
                    { a: { fake: 'mask' } },
                    transportLayer === 'DataChannel'
                        ? new DataChannelSubject(createDataChannelObserver, createTransportObservable, dataChannelOrWebSocket, {})
                        : new WebSocketSubject(createTransportObservable, createWebSocketObserver, dataChannelOrWebSocket, {})
                );
            });

            it('should augment messages with the mask when calling next()', () => {
                dataChannelOrWebSocket.readyState = transportLayer === 'DataChannel' ? 'open' : WebSocket.OPEN;

                maskedSubject.next(message);

                expect(dataChannelOrWebSocket.send).to.have.been.calledOnce;
                expect(dataChannelOrWebSocket.send).to.have.been.calledWithExactly('{"a":{"fake":"mask"},"message":{"a":"fake message"}}');
            });

            it('should augment messages with the mask when calling send()', () => {
                const { promise, resolve } = Promise.withResolvers();

                dataChannelOrWebSocket.readyState = transportLayer === 'DataChannel' ? 'open' : WebSocket.OPEN;

                maskedSubject.send(message).then(() => {
                    expect(dataChannelOrWebSocket.send).to.have.been.calledOnce;
                    expect(dataChannelOrWebSocket.send).to.have.been.calledWithExactly(
                        '{"a":{"fake":"mask"},"message":{"a":"fake message"}}'
                    );

                    resolve();
                });

                return promise;
            });

            it('should filter messages by the mask', () => {
                const { promise, resolve } = Promise.withResolvers();
                const subscription = maskedSubject.subscribe({
                    next(mssg) {
                        expect(mssg).to.equal(message);

                        subscription.unsubscribe();

                        resolve();
                    }
                });

                dataChannelOrWebSocket.dispatchEvent({ data: { a: { fake: 'mask' }, message }, type: 'message' });

                return promise;
            });
        });
    }
});
