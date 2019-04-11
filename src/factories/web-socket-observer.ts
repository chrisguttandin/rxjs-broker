import { WebSocketObserver } from '../classes/web-socket-observer';
import { TWebSocketObserverFactory } from '../types';

export const createWebSocketObserver: TWebSocketObserverFactory = <T>(webSocket: WebSocket) => {
    return new WebSocketObserver<T>(webSocket);
};
