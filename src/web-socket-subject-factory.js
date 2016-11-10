import { AnonymousSubject } from 'rxjs/Subject';
import { Inject } from '@angular/core';
import { WebSocketObservableFactory } from './web-socket-observable-factory';
import { WebSocketObserverFactory } from './web-socket-observer-factory';
import { filter } from 'rxjs/operator/filter';
import { map } from 'rxjs/operator/map';

class WebSocketSubject extends AnonymousSubject {

    constructor ({ webSocket, webSocketObservableFactory, webSocketObserverFactory }) {
        var observable = webSocketObservableFactory.create({ webSocket }),
            observer = webSocketObserverFactory.create({ webSocket });

        super(observer, observable);

        this._webSocket = webSocket;
    }

    close () {
        this._webSocket.close();
    }

    mask (mask) {
        var maskedSubject = this
                ::filter((message) => Object
                    .keys(mask)
                    .every((key) => JSON.stringify(mask[key]) === JSON.stringify(message[key])))
                ::map(({ message }) => message);

        maskedSubject.next = ((next) => (message) => next.call(this, { ...mask, message: { ...message } }))(this.next);
        maskedSubject.send = ((send) => (message) => send.call(this, { ...mask, message: { ...message } }))(this.send);

        return maskedSubject;
    }

    send (message) {
        if (this.isUnsubscribed) {
            // throw new ObjectUnsubscribedError();
        }

        if (!this.isStopped) {
            this.destination.send(message);
        }
    }

}

export class WebSocketSubjectFactory {

    constructor (webSocketObservableFactory, webSocketObserverFactory) {
        this._options = { webSocketObservableFactory, webSocketObserverFactory };
    }

    create ({ webSocket }) {
        return new WebSocketSubject({ ...this._options, webSocket });
    }

}

WebSocketSubjectFactory.parameters = [ [ new Inject(WebSocketObservableFactory) ], [ new Inject(WebSocketObserverFactory) ] ];
