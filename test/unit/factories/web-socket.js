import 'core-js/es7/reflect';
import { ReflectiveInjector } from '@angular/core';
import { WebSocketFactory } from '../../../src/factories/web-socket';
import { WebSocketMock } from '../../mock/web-socket';

describe('WebSocketFactory', () => {

    let globalWebSocket;

    let webSocket;

    let webSocketFactory;

    afterEach(() => {
        WebSocket = globalWebSocket; // eslint-disable-line no-global-assign
    });

    beforeEach(() => {
        globalWebSocket = WebSocket;

        webSocket = new WebSocketMock();
        WebSocket = sinon.stub(); // eslint-disable-line no-global-assign, no-undef

        WebSocket.returns(webSocket);
    });

    beforeEach(() => {
        const injector = ReflectiveInjector.resolveAndCreate([
            WebSocketFactory
        ]);

        webSocketFactory = injector.get(WebSocketFactory);
    });

    describe('create()', () => {

        let url;

        beforeEach(() => url = 'a fake URL');

        it('should create a new WebSocket with the given URL', () => {
            webSocketFactory.create({ url });

            expect(WebSocket).to.have.been.calledOnce;
            expect(WebSocket).to.have.been.calledWithExactly(url);
        });

        it('should return a new WebSocket', () => {
            expect(webSocketFactory.create({ url })).to.equal(webSocket);
        });

    });

});
