import { connect } from '../../src/module';

describe('module', () => {

    describe('connect()', () => {

        it('should connect to a WebSocket and send and receive a messagge', function (done) {
            this.timeout(5000);

            connect('ws://echo.websocket.org')
                .then((webSocketBroker) => webSocketBroker.register('a fake type'))
                .then((webSocketSubject) => {
                    var message = { a: 'b', c: 'd' };

                    webSocketSubject.subscribe({
                        next (mssge) {
                            expect(mssge).to.deep.equal(message);

                            done();
                        }
                    });

                    webSocketSubject.send(message);
                });
        });

    });

});
