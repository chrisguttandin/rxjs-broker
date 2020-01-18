import { WebSocketSubject } from '../classes/web-socket-subject';
import { IWebSocketSubjectConfig } from '../interfaces';
import { TStringifyableJsonValue, TWebSocketSubjectFactoryFactory } from '../types';

export const createWebSocketSubjectFactory: TWebSocketSubjectFactoryFactory = (createWebSocketObservable, createWebSocketObserver) => {
    return <T extends TStringifyableJsonValue>(webSocket: WebSocket, webSocketSubjectConfig: IWebSocketSubjectConfig) => {
        return new WebSocketSubject<T>(createWebSocketObservable, createWebSocketObserver, webSocket, webSocketSubjectConfig);
    };
};
