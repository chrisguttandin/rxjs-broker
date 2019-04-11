import { WebSocketSubject } from '../classes/web-socket-subject';
import { TStringifyableJsonValue } from './stringifyable-json-value';

export type TWebSocketSubjectFactory = <T extends TStringifyableJsonValue>(webSocket: WebSocket) => WebSocketSubject<T>;
