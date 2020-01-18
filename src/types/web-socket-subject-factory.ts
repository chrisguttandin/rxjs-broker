import { WebSocketSubject } from '../classes/web-socket-subject';
import { ISubjectConfig } from '../interfaces';
import { TStringifyableJsonValue } from './stringifyable-json-value';

export type TWebSocketSubjectFactory = <T extends TStringifyableJsonValue>(
    webSocket: WebSocket,
    subjectConfig: ISubjectConfig
) => WebSocketSubject<T>;
