import 'reflect-metadata';
import { Observable } from 'rxjs/Observable';
import { ReflectiveInjector } from '@angular/core';
import { WebSocketFactory } from '../../src/web-socket-factory';
import { WebSocketFactoryMock } from '../mock/web-socket-factory';
import { WebSocketObservableFactory } from '../../src/web-socket-observable-factory';

describe('WebSocketObservableFactory', () => {

    var webSocketObservableFactory;

    beforeEach(() => {
        /* eslint-disable indent */
        var injector = ReflectiveInjector.resolveAndCreate([
                WebSocketObservableFactory
            ]);
        /* eslint-enable indent */

        webSocketObservableFactory = injector.get(WebSocketObservableFactory);
    });

    describe('create()', () => {

        it('should return an Observable', () => {
            expect(webSocketObservableFactory.create({})).to.be.an.instanceOf(Observable);
        });

    });

});

describe('WebSocketObservable', () => {

    var webSocket,
        webSocketObservable;

    beforeEach(() => {
        var injector,
            webSocketFactory,
            webSocketObservableFactory;

        injector = ReflectiveInjector.resolveAndCreate([
            { provide: WebSocketFactory, useClass: WebSocketFactoryMock },
            WebSocketObservableFactory
        ]);

        webSocketFactory = injector.get(WebSocketFactory);
        webSocketObservableFactory = injector.get(WebSocketObservableFactory);

        webSocket = webSocketFactory.create();
        webSocketObservable = webSocketObservableFactory.create({ webSocket });
    });

    describe('subscribe()', () => {

        it('should pass on a message event to the subscribed observer', (done) => {
            var message,
                webSocketSubscription;

            message = 'a fake message';
            webSocketSubscription = webSocketObservable
                .subscribe({
                    next (mssg) {
                        expect(mssg).to.equal(message);

                        webSocketSubscription.unsubscribe();

                        done();
                    }
                });

            webSocket.dispatchEvent({ data: message, type: 'message' });
        });

        it('should pass on an error event to the subscribed observer', (done) => {
            var error = 'a fake error';

            webSocketObservable
                .subscribe({
                    error (err) {
                        expect(err).to.equal(error);

                        done();
                    }
                });

            webSocket.dispatchEvent({ error, type: 'error' });
        });

        it('should complete the subscribed observer on a close event', (done) => {
            webSocketObservable
                .subscribe({
                    complete () {
                        done();
                    }
                });

            webSocket.dispatchEvent({ type: 'close' });
        });

    });

});
