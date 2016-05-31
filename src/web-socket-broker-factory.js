import { Inject } from '@angular/core/src/di/decorators';
import { WebSocketFactory } from './web-socket-factory';
import { WebSocketSubjectFactory } from './web-socket-subject-factory';
import { _finally as fnll } from 'rxjs/operator/finally';

class WebSocketBroker {

    constructor ({ webSocket, webSocketSubjectFactory }) {
        this._webSocket = webSocket;
        this._webSocketSubjectFactory = webSocketSubjectFactory;
        this._webSocketSubjects = new Set();
    }

    close () {
        this._webSocket.close();

        if (this._webSocketSubjects.size > 0) {
            let error = new Error('The socket has been closed.');

            for (let webSocketSubject of this._webSocketSubjects) {
                webSocketSubject.error(error);
            }
        }
    }

    register (type) {
        /* eslint-disable indent */
        let webSocketSubject = this._webSocketSubjectFactory.create({
                type,
                webSocket: this._webSocket
            });
        /* eslint-enable indent */

        this._webSocketSubjects.add(webSocketSubject);
        webSocketSubject::fnll(() => this._webSocketSubjects.delete(webSocketSubject));

        return webSocketSubject;
    }

}

export class WebSocketBrokerFactory {

    constructor (webSocketFactory, webSocketSubjectFactory) {
        this._options = { webSocketSubjectFactory };
        this._webSocketFactory = webSocketFactory;
    }

    async create ({ url }) {
        var webSocket = await this._webSocketFactory.create({ url });

        return new WebSocketBroker({ ...this._options, webSocket });
    }

}

WebSocketBrokerFactory.parameters = [ [ new Inject(WebSocketFactory) ], [ new Inject(WebSocketSubjectFactory) ] ];
