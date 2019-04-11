import { WebSocketSubject } from '../classes/web-socket-subject';
import { TStringifyableJsonValue, TWebSocketSubjectFactoryFactory } from '../types';

export const createWebSocketSubjectFactory: TWebSocketSubjectFactoryFactory = (createWebSocketObservable, createWebSocketObserver) => {
    return <T extends TStringifyableJsonValue>(webSocket: WebSocket) => {
        return new WebSocketSubject<T>(createWebSocketObservable, createWebSocketObserver, webSocket);
    };
};
