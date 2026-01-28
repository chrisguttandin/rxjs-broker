import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { connect, isSupported, mask, wrap } from '../../src/module';
import { commands } from 'vitest/browser';
import { establishDataChannels } from '../helper/establish-data-channels';

describe('module', () => {
    describe('isSupported', () => {
        it('should be a boolean', () => {
            expect(isSupported).to.be.a('boolean');
        });
    });

    describe('connect()', () => {
        let message;
        let openObserverNext;
        let webSocketSubject;

        afterEach(() => {
            webSocketSubject.close();

            return commands.stopWebSocketServer();
        });

        beforeEach(async () => {
            message = { a: 'b', c: 'd' };

            const port = 5432;

            await commands.startWebSocketServer(port);

            webSocketSubject = connect(`ws://localhost:${port}`, {
                openObserver: {
                    next() {
                        if (openObserverNext !== undefined) {
                            openObserverNext();
                        }
                    }
                }
            });
        });

        it('should call next on a given openObserver', () => {
            const { promise, resolve } = Promise.withResolvers();

            openObserverNext = () => resolve();

            webSocketSubject.subscribe();

            return promise;
        });

        it('should connect to a WebSocket and send and receive an unmasked messagge', () => {
            const { promise, resolve } = Promise.withResolvers();

            webSocketSubject.subscribe({
                next(mssge) {
                    expect(mssge).to.deep.equal(message);

                    resolve();
                }
            });

            webSocketSubject.send(message);

            return promise;
        });

        it('should connect to a WebSocket and send and receive a masked messagge', () => {
            const { promise, resolve } = Promise.withResolvers();

            webSocketSubject = mask({ a: 'fake mask' }, webSocketSubject);

            webSocketSubject.subscribe({
                next(mssge) {
                    expect(mssge).to.deep.equal(message);

                    resolve();
                }
            });

            webSocketSubject.send(message);

            return promise;
        });

        it('should connect to a WebSocket and send and receive a deeply masked messagge', () => {
            const { promise, resolve } = Promise.withResolvers();

            webSocketSubject = mask({ another: 'fake mask' }, mask({ a: 'fake mask' }, webSocketSubject));

            webSocketSubject.subscribe({
                next(mssge) {
                    expect(mssge).to.deep.equal(message);

                    resolve();
                }
            });

            webSocketSubject.send(message);

            return promise;
        });
    });

    describe('mask()', ({ skip }) => {
        // @todo
        skip();
    });

    describe('wrap()', () => {
        let dataChannelSubject;
        let openObserverNext;
        let remoteDataChannel;

        afterEach(() => dataChannelSubject.close());

        beforeEach(() => {
            const dataChannels = establishDataChannels();

            dataChannelSubject = wrap(dataChannels.localDataChannel, {
                openObserver: {
                    next() {
                        if (openObserverNext !== undefined) {
                            openObserverNext();
                        }
                    }
                }
            });
            remoteDataChannel = dataChannels.remoteDataChannel;
        });

        it('should call next on a given openObserver', () => {
            const { promise, resolve } = Promise.withResolvers();

            openObserverNext = () => resolve();

            dataChannelSubject.subscribe();

            return promise;
        });

        describe('with a message', () => {
            let message;

            beforeEach(() => {
                message = { a: 'b', c: 'd' };
            });

            it('should send and receive a messagge through an unmasked data channel', () => {
                const { promise, resolve } = Promise.withResolvers();

                dataChannelSubject.subscribe({
                    next(mssge) {
                        expect(mssge).to.deep.equal(message);

                        resolve();
                    }
                });

                remoteDataChannel.addEventListener('message', (event) => {
                    expect(event.data).to.equal('{"a":"b","c":"d"}');

                    remoteDataChannel.send(event.data);
                });

                dataChannelSubject.send(message);

                return promise;
            });

            it('should send and receive a messagge through a masked data channel', () => {
                const { promise, resolve } = Promise.withResolvers();

                dataChannelSubject = mask({ a: 'fake mask' }, dataChannelSubject);

                dataChannelSubject.subscribe({
                    next(mssge) {
                        expect(mssge).to.deep.equal(message);

                        resolve();
                    }
                });

                remoteDataChannel.addEventListener('message', (event) => {
                    expect(event.data).to.equal('{"a":"fake mask","message":{"a":"b","c":"d"}}');

                    remoteDataChannel.send(event.data);
                });

                dataChannelSubject.send(message);

                return promise;
            });

            it('should send and receive a messagge through a deeply masked data channel', () => {
                const { promise, resolve } = Promise.withResolvers();

                dataChannelSubject = mask({ another: 'fake mask' }, mask({ a: 'fake mask' }, dataChannelSubject));

                dataChannelSubject.subscribe({
                    next(mssge) {
                        expect(mssge).to.deep.equal(message);

                        resolve();
                    }
                });

                remoteDataChannel.addEventListener('message', (event) => {
                    expect(event.data).to.equal('{"a":"fake mask","message":{"another":"fake mask","message":{"a":"b","c":"d"}}}');

                    remoteDataChannel.send(event.data);
                });

                dataChannelSubject.send(message);

                return promise;
            });
        });

        describe('without a message', () => {
            it('should send and receive an empty messagge through a masked data channel', () => {
                const { promise, resolve } = Promise.withResolvers();

                dataChannelSubject = mask({ a: 'fake mask' }, dataChannelSubject);

                dataChannelSubject.subscribe({
                    next(message) {
                        expect(message).to.be.undefined;

                        resolve();
                    }
                });

                remoteDataChannel.addEventListener('message', (event) => {
                    expect(event.data).to.equal('{"a":"fake mask"}');

                    remoteDataChannel.send(event.data);
                });

                dataChannelSubject.send();

                return promise;
            });
        });
    });
});
