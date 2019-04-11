import { WebSocketObserver } from '../classes/web-socket-observer';

export const createWebSocketObserver = <T>(webSocket: WebSocket) => {
    return new WebSocketObserver<T>(webSocket);
};
