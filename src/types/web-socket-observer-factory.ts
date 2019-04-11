import { WebSocketObserver } from '../classes/web-socket-observer';

export type TWebSocketObserverFactory = <T>(webSocket: WebSocket) => WebSocketObserver<T>;
