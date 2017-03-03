import { Injectable } from '@angular/core';
import { AnonymousSubject } from 'rxjs/Subject';
import { IMaskableSubject, IWebSocketSubjectFactoryOptions, IWebSocketSubjectOptions } from '../interfaces';
import { TJsonValue } from '../types';
import { MaskedWebSocketSubject, MaskedWebSocketSubjectFactory } from './masked-web-socket-subject';
import { WebSocketObservableFactory } from './web-socket-observable';
import { WebSocketObserverFactory } from './web-socket-observer';

export class WebSocketSubject extends AnonymousSubject<TJsonValue> implements IMaskableSubject {

    private _maskedWebSocketSubjectFactory: MaskedWebSocketSubjectFactory;

    private _webSocket: WebSocket;

    constructor ({
        maskedWebSocketSubjectFactory, webSocket, webSocketObservableFactory, webSocketObserverFactory
    }: IWebSocketSubjectOptions) {
        const observable = webSocketObservableFactory.create({ webSocket });

        const observer = webSocketObserverFactory.create({ webSocket });

        super(observer, observable);

        this._maskedWebSocketSubjectFactory = maskedWebSocketSubjectFactory;
        this._webSocket = webSocket;
    }

    public close () {
        this._webSocket.close();
    }

    public mask (mask: TJsonValue): MaskedWebSocketSubject {
        return this._maskedWebSocketSubjectFactory.create({ maskableSubject: this, mask });
    }

    public send (message: TJsonValue) {
        const { destination }: any = this;

        if (!this.isStopped) {
            return destination.send(message);
        }
    }

}

@Injectable()
export class WebSocketSubjectFactory {

    private _options: {
        maskedWebSocketSubjectFactory: MaskedWebSocketSubjectFactory,
        webSocketObservableFactory: WebSocketObservableFactory,
        webSocketObserverFactory: WebSocketObserverFactory
    };

    constructor (
        maskedWebSocketSubjectFactory: MaskedWebSocketSubjectFactory,
        webSocketObservableFactory: WebSocketObservableFactory,
        webSocketObserverFactory: WebSocketObserverFactory
    ) {
        this._options = { maskedWebSocketSubjectFactory, webSocketObservableFactory, webSocketObserverFactory };
    }

    public create ({ webSocket }: IWebSocketSubjectFactoryOptions): IMaskableSubject {
        return new WebSocketSubject(Object.assign({}, this._options, { webSocket }));
    }

}
