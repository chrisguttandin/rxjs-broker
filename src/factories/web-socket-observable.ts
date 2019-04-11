import { WebSocketObservable } from '../classes/web-socket-observable';
import { TWebSocketObservableFactory } from '../types';

export const createWebSocketObservable: TWebSocketObservableFactory = <T>(webSocket: WebSocket) => {
    return new WebSocketObservable<T>(webSocket);
};
