import { WebSocketObservable } from '../classes/web-socket-observable';

export const createWebSocketObservable = <T>(webSocket: WebSocket) => {
    return new WebSocketObservable<T>(webSocket);
};
