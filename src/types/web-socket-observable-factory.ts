import { WebSocketObservable } from '../classes/web-socket-observable';
import { IWebSocketSubjectConfig } from '../interfaces';

export type TWebSocketObservableFactory = <T>(
    webSocket: WebSocket,
    webSocketSubjectConfig: IWebSocketSubjectConfig
) => WebSocketObservable<T>;
