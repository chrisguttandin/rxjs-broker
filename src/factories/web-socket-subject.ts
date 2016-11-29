import { IMaskableSubject } from '../interfaces/maskable-subject';
import { MaskedWebSocketSubjectFactory } from './masked-web-socket-subject';
import { WebSocketObservableFactory } from './web-socket-observable';
import { WebSocketObserverFactory } from './web-socket-observer';
import { Inject, Injectable } from '@angular/core';
import { AnonymousSubject } from 'rxjs/Subject';

export class WebSocketSubject<T> extends AnonymousSubject<T> implements IMaskableSubject {

    private _maskedWebSocketSubjectFactory;

    private _webSocket;

    constructor ({ maskedWebSocketSubjectFactory, webSocket, webSocketObservableFactory, webSocketObserverFactory }) {
        const observable = webSocketObservableFactory.create({ webSocket });

        const observer = webSocketObserverFactory.create({ webSocket });

        super(observer, observable);

        this._maskedWebSocketSubjectFactory = maskedWebSocketSubjectFactory;
        this._webSocket = webSocket;
    }

    public close () {
        this._webSocket.close();
    }

    public mask (mask) {
        return this._maskedWebSocketSubjectFactory.create({ mask, webSocketSubject: this });
    }

    public send (message) {
        const { destination }: any = this;

        if (!this.isStopped) {
            return destination.send(message);
        }
    }

}

@Injectable()
export class WebSocketSubjectFactory {

    private _options;

    constructor (
        @Inject(MaskedWebSocketSubjectFactory) maskedWebSocketSubjectFactory,
        @Inject(WebSocketObservableFactory) webSocketObservableFactory,
        @Inject(WebSocketObserverFactory) webSocketObserverFactory
    ) {
        this._options = { maskedWebSocketSubjectFactory, webSocketObservableFactory, webSocketObserverFactory };
    }

    public create ({ webSocket }): IMaskableSubject {
        return new WebSocketSubject(Object.assign({}, this._options, { webSocket }));
    }

}
