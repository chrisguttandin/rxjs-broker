import { Injectable } from '@angular/core';
import { WebSocketSubject } from '../classes/web-socket-subject';
import { IMaskableSubject, IWebSocketSubjectFactoryOptions } from '../interfaces';
import { TStringifyableJsonValue } from '../types';
import { MaskedWebSocketSubjectFactory } from './masked-web-socket-subject';
import { WebSocketObservableFactory } from './web-socket-observable';
import { WebSocketObserverFactory } from './web-socket-observer';

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
