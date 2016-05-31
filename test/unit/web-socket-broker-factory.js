import 'reflect-metadata';
import { ReflectiveInjector } from '@angular/core';
import { WebSocketBrokerFactory } from '../../src/web-socket-broker-factory';
import { WebSocketFactory } from '../../src/web-socket-factory';
import { WebSocketFactoryMock } from '../mock/web-socket-factory';
import { WebSocketSubjectFactory } from '../../src/web-socket-subject-factory';
import { WebSocketSubjectFactoryMock } from '../mock/web-socket-subject-factory';

describe('WebSocketBrokerFactory', () => {

    var webSocketBrokerFactory,
        webSocketFactory,
        webSocketSubjectFactory;

    beforeEach(() => {
        /* eslint-disable indent */
        var injector = ReflectiveInjector.resolveAndCreate([
                WebSocketBrokerFactory,
                { provide: WebSocketFactory, useClass: WebSocketFactoryMock },
                { provide: WebSocketSubjectFactory, useClass: WebSocketSubjectFactoryMock }
            ]);
        /* eslint-enable indent */

        webSocketBrokerFactory = injector.get(WebSocketBrokerFactory);
        webSocketFactory = injector.get(WebSocketFactory);
        webSocketSubjectFactory = injector.get(WebSocketSubjectFactory);
    });

    describe('constructor', () => {

        it('should create a new WebSocketBroker with the given URL', (done) => {
            var url = 'a fake URL';

            webSocketBrokerFactory
                .create({ url })
                .then(() => {
                    expect(webSocketFactory.create).to.have.been.calledOnce;
                    expect(webSocketFactory.create).to.have.been.calledWithExactly({ url });

                    done();
                });
        });

    });

    describe('close()', () => {

        var webSocketBroker;

        beforeEach(async () => webSocketBroker = await webSocketBrokerFactory.create({ url: 'a fake URL' }));

        it('should close the socket', () => {
            var webSocket;

            webSocketBroker.close();

            webSocket = webSocketFactory.webSockets[0];

            expect(webSocket.close).to.have.been.calledOnce;
            expect(webSocket.close).to.have.been.calledWithExactly();
        });

        it('should throw an error on all registered subjects', (done) => {
            webSocketBroker
                .register('a fake type')
                .subscribe({
                    error (err) {
                        expect(err).to.be.an.instanceOf(Error);
                        expect(err.message).to.equal('The socket has been closed.');

                        done();
                    }
                });

            webSocketBroker.close();
        });

        it('should not throw an error on completed subjects', (done) => {
            webSocketBroker
                .register('a fake type')
                .subscribe({
                    complete () {
                        webSocketBroker.close();
                    },
                    error (err) {
                        done(err);
                    }
                })
                .complete();

            setTimeout(() => done(), 200);
        });

    });

    describe('register()', () => {

        it('should create a new WebSocketSubject', (done) => {
            webSocketBrokerFactory
                .create({ url: 'a fake URL' })
                .then((webSocketBroker) => {
                    var type,
                        webSocket;

                    type = 'a fake type';

                    webSocketBroker.register('a fake type');

                    webSocket = webSocketFactory.webSockets[0];

                    expect(webSocketSubjectFactory.create).to.have.been.calledOnce;
                    expect(webSocketSubjectFactory.create).to.have.been.calledWithExactly({ type, webSocket });

                    done();
                });
        });

    });

});
