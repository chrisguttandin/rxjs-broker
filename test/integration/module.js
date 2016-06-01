import { connect } from '../../src/module';

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

});
