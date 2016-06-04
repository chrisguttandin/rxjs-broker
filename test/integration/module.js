import { connect, wrap } from '../../src/module';
import { establishDataChannels } from '../helper/establish-data-channels';

describe('module', () => {

    describe('connect()', () => {

        it('should connect to a WebSocket and send and receive a messagge', function (done) {
            var message,
                webSocketSubject;

            this.timeout(10000);

            message = { a: 'b', c: 'd' };
            webSocketSubject = connect('ws://echo.websocket.org')
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

    });

    describe('wrap()', () => {

        it('should send and receive a messagge through a data channel', function (done) {
            this.timeout(10000);

            establishDataChannels()
                .then(({ localDataChannel, remoteDataChannel }) => {
                    var dataChannelSubject,
                        message;

                    dataChannelSubject = wrap(localDataChannel)
                        .mask({ a: 'fake mask' });
                    message = { a: 'b', c: 'd' };

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
        });

    });

});
