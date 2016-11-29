import { connect, wrap } from '../../src/module';
import { establishDataChannels } from '../helper/establish-data-channels';

describe('module', () => {

    describe('connect()', () => {

        let message;

        let webSocketSubject;

        afterEach(() => webSocketSubject.close());

        beforeEach(() => {
            message = { a: 'b', c: 'd' };

            webSocketSubject = connect('ws://echo.websocket.org');
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

            webSocketSubject = webSocketSubject
                .mask({ a: 'fake mask' });

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

            webSocketSubject = webSocketSubject
                .mask({ a: 'fake mask' })
                .mask({ another: 'fake mask' });

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

    describe('wrap()', () => {

        let dataChannelSubject;

        let message;

        let remoteDataChannel;

        afterEach(() => dataChannelSubject.close());

        beforeEach(() => {
            message = { a: 'b', c: 'd' };

            return establishDataChannels()
                .then(({ localDataChannel, remoteDataChannel: rmtDtChnnl }) => {
                    dataChannelSubject = wrap(localDataChannel);
                    remoteDataChannel = rmtDtChnnl;
                });
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

            dataChannelSubject = dataChannelSubject
                .mask({ a: 'fake mask' });

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

            dataChannelSubject = dataChannelSubject
                .mask({ a: 'fake mask' })
                .mask({ another: 'fake mask' });

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

});
