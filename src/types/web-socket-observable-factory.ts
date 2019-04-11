import { WebSocketObservable } from '../classes/web-socket-observable';

export type TWebSocketObservableFactory = <T>(webSocket: WebSocket) => WebSocketObservable<T>;
