import { WebSocketSubject } from '../classes/web-socket-subject';
import { ISubjectConfig } from '../interfaces';
import { TStringifyableJsonValue, TWebSocketSubjectFactoryFactory } from '../types';

export const createWebSocketSubjectFactory: TWebSocketSubjectFactoryFactory = (createTransportObservable, createWebSocketObserver) => {
    return <T extends TStringifyableJsonValue>(webSocket: WebSocket, subjectConfig: ISubjectConfig<T>) => {
        return new WebSocketSubject<T>(createTransportObservable, createWebSocketObserver, webSocket, subjectConfig);
    };
};
