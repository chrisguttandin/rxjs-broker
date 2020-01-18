import { WebSocketSubject } from '../classes/web-socket-subject';
import { IWebSocketSubjectConfig } from '../interfaces';
import { TStringifyableJsonValue } from './stringifyable-json-value';

export type TWebSocketSubjectFactory = <T extends TStringifyableJsonValue>(
    webSocket: WebSocket,
    webSocketSubjectConfig: IWebSocketSubjectConfig
) => WebSocketSubject<T>;
