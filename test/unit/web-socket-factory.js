import 'reflect-metadata';
import { stub } from 'sinon';
import { ReflectiveInjector } from '@angular/core';
import { WebSocketFactory } from '../../src/web-socket-factory';
import { WebSocketMock } from '../mock/web-socket';

describe('WebSocketFactory', () => {

    var webSocket,
        webSocketFactory;

    beforeEach(() => {
        webSocket = new WebSocketMock();
        WebSocket = stub();

        WebSocket.returns(webSocket);
    });

    beforeEach(() => {
        /* eslint-disable indent */
        var injector = ReflectiveInjector.resolveAndCreate([
                WebSocketFactory
            ]);
        /* eslint-enable indent */

        webSocketFactory = injector.get(WebSocketFactory);
    });

    describe('create()', () => {

        it('should create a new WebSocket with the given URL', (done) => {
            var url = 'a fake URL';

            webSocketFactory
                .create({ url })
                .then((webSocket) => {
                    expect(WebSocket).to.have.been.calledOnce;
                    expect(WebSocket).to.have.been.calledWithExactly(url);

                    done();
                });

            webSocket.dispatchEvent({ type: 'open' });
        });

        it('should fail to create a new WebSocket in case of an error', (done) => {
            var error = 'a fake error',
                url = 'a fake URL';

            webSocketFactory
                .create({ url })
                .catch((err) => {
                    expect(err).to.equal(error);

                    done();
                });

            webSocket.dispatchEvent({ error, type: 'error' });
        });

    });

});
