import { connect, isSupported, mask, wrap } from '../../src/module';
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

        afterEach(() => webSocketSubject.close());

        beforeEach(() => {
            message = { a: 'b', c: 'd' };

            webSocketSubject = connect(
                'ws://echo.websocket.org',
                {
                    openObserver: {
                        next () {
                            if (openObserverNext !== undefined) {
                                openObserverNext();
                            }
                        }
                    }
                }
            );
        });

        it('should call next on a given openObserver', function (done) {
            this.timeout(10000);

            openObserverNext = done;

            webSocketSubject.subscribe();
        });

        it('should connect to a WebSocket and send and receive an unmasked messagge', function (done) {
            this.timeout(10000);

            webSocketSubject
                .subscribe({
                    next (mssge) {
                        expect(mssge).to.deep.equal(message);

                        done();
                    }
                });

            webSocketSubject.send(message);
        });

        it('should connect to a WebSocket and send and receive a masked messagge', function (done) {
            this.timeout(10000);

            webSocketSubject = mask({ a: 'fake mask' }, webSocketSubject);

            webSocketSubject
                .subscribe({
                    next (mssge) {
                        expect(mssge).to.deep.equal(message);

                        done();
                    }
                });

            webSocketSubject.send(message);
        });

        it('should connect to a WebSocket and send and receive a deeply masked messagge', function (done) {
            this.timeout(10000);

            webSocketSubject = mask({ another: 'fake mask' }, mask({ a: 'fake mask' }, webSocketSubject));

            webSocketSubject
                .subscribe({
                    next (mssge) {
                        expect(mssge).to.deep.equal(message);

                        done();
                    }
                });

            webSocketSubject.send(message);
        });

    });

    describe('mask()', () => {

        // @todo

    });

    describe('wrap()', () => {

        let dataChannelSubject;
        let openObserverNext;
        let remoteDataChannel;

        afterEach(() => dataChannelSubject.close());

        beforeEach(() => {
            const dataChannels = establishDataChannels();

            dataChannelSubject = wrap(
                dataChannels.localDataChannel,
                {
                    openObserver: {
                        next () {
                            if (openObserverNext !== undefined) {
                                openObserverNext();
                            }
                        }
                    }
                }
            );
            remoteDataChannel = dataChannels.remoteDataChannel;
        });

        it('should call next on a given openObserver', function (done) {
            this.timeout(10000);

            openObserverNext = done;

            dataChannelSubject.subscribe();
        });

        describe('with a message', () => {

            let message;

            beforeEach(() => {
                message = { a: 'b', c: 'd' };
            });

            it('should send and receive a messagge through an unmasked data channel', function (done) {
                this.timeout(10000);

                dataChannelSubject
                    .subscribe({
                        next (mssge) {
                            expect(mssge).to.deep.equal(message);

                            done();
                        }
                    });

                remoteDataChannel.addEventListener('message', (event) => {
                    expect(event.data).to.equal('{"a":"b","c":"d"}');

                    remoteDataChannel.send(event.data);
                });

                dataChannelSubject.send(message);
            });

            it('should send and receive a messagge through a masked data channel', function (done) {
                this.timeout(10000);

                dataChannelSubject = mask({ a: 'fake mask' }, dataChannelSubject);

                dataChannelSubject
                    .subscribe({
                        next (mssge) {
                            expect(mssge).to.deep.equal(message);

                            done();
                        }
                    });

                remoteDataChannel.addEventListener('message', (event) => {
                    expect(event.data).to.equal('{"a":"fake mask","message":{"a":"b","c":"d"}}');

                    remoteDataChannel.send(event.data);
                });

                dataChannelSubject.send(message);
            });

            it('should send and receive a messagge through a deeply masked data channel', function (done) {
                this.timeout(10000);

                dataChannelSubject = mask({ another: 'fake mask' }, mask({ a: 'fake mask' }, dataChannelSubject));

                dataChannelSubject
                    .subscribe({
                        next (mssge) {
                            expect(mssge).to.deep.equal(message);

                            done();
                        }
                    });

                remoteDataChannel.addEventListener('message', (event) => {
                    expect(event.data).to.equal('{"a":"fake mask","message":{"another":"fake mask","message":{"a":"b","c":"d"}}}');

                    remoteDataChannel.send(event.data);
                });

                dataChannelSubject.send(message);
            });

        });

        describe('without a message', () => {

            it('should send and receive an empty messagge through a masked data channel', function (done) {
                this.timeout(10000);

                dataChannelSubject = mask({ a: 'fake mask' }, dataChannelSubject);

                dataChannelSubject
                    .subscribe({
                        next (message) {
                            expect(message).to.be.undefined;

                            done();
                        }
                    });

                remoteDataChannel.addEventListener('message', (event) => {
                    expect(event.data).to.equal('{"a":"fake mask"}');

                    remoteDataChannel.send(event.data);
                });

                dataChannelSubject.send();
            });

        });

    });

});
