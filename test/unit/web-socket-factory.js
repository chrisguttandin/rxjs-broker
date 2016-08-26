import 'reflect-metadata';
import { ReflectiveInjector } from '@angular/core';
import { WebSocketFactory } from '../../src/web-socket-factory';
import { WebSocketMock } from '../mock/web-socket';
import { stub } from 'sinon';

describe('WebSocketFactory', () => {

    var globalWebSocket,
        webSocket,
        webSocketFactory;

    afterEach(() => {
        WebSocket = globalWebSocket; // eslint-disable-line no-global-assign
    });

    beforeEach(() => {
        globalWebSocket = WebSocket;

        webSocket = new WebSocketMock();
        WebSocket = stub(); // eslint-disable-line no-global-assign

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

        var url;

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
