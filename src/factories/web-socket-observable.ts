import { WebSocketObservable } from '../classes/web-socket-observable';
import { IWebSocketSubjectConfig } from '../interfaces';

export const createWebSocketObservable = <T>(webSocket: WebSocket, webSocketSubjectConfig: IWebSocketSubjectConfig) => {
    return new WebSocketObservable<T>(webSocket, webSocketSubjectConfig);
};
