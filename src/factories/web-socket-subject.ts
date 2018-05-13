import { Injectable } from '@angular/core';
import { AnonymousSubject } from 'rxjs/internal/Subject'; // tslint:disable-line no-submodule-imports rxjs-no-internal
import { IMaskableSubject, IParsedJsonObject, IWebSocketSubjectFactoryOptions, IWebSocketSubjectOptions } from '../interfaces';
import { TStringifyableJsonValue } from '../types';
import { MaskedWebSocketSubject, MaskedWebSocketSubjectFactory } from './masked-web-socket-subject';
import { WebSocketObservableFactory } from './web-socket-observable';
import { WebSocketObserverFactory } from './web-socket-observer';

export class WebSocketSubject extends AnonymousSubject<TStringifyableJsonValue> implements IMaskableSubject<TStringifyableJsonValue> {

    private _maskedWebSocketSubjectFactory: MaskedWebSocketSubjectFactory;

    private _webSocket: WebSocket;

    constructor ({
        maskedWebSocketSubjectFactory, webSocket, webSocketObservableFactory, webSocketObserverFactory
    }: IWebSocketSubjectOptions) {
        const observable = webSocketObservableFactory.create<TStringifyableJsonValue>({ webSocket });

        const observer = webSocketObserverFactory.create<TStringifyableJsonValue>({ webSocket });

        super(observer, observable);

        this._maskedWebSocketSubjectFactory = maskedWebSocketSubjectFactory;
        this._webSocket = webSocket;
    }

    public close () {
        this._webSocket.close();
    }

    public mask <TMessage extends TStringifyableJsonValue> (mask: IParsedJsonObject): MaskedWebSocketSubject<TMessage> {
        return this._maskedWebSocketSubjectFactory.create<TMessage>({ maskableSubject: this, mask });
    }

    public send (message: TStringifyableJsonValue) {
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

    public create ({ webSocket }: IWebSocketSubjectFactoryOptions): IMaskableSubject<TStringifyableJsonValue> {
        return new WebSocketSubject({ ...this._options, webSocket });
    }

}

export const WEB_SOCKET_SUBJECT_FACTORY_PROVIDER = {
    deps: [ MaskedWebSocketSubjectFactory, WebSocketObservableFactory, WebSocketObserverFactory ],
    provide: WebSocketSubjectFactory
};
