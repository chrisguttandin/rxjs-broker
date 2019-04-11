import { WebSocketSubject } from '../classes/web-socket-subject';
import { TWebSocketSubjectFactoryFactory } from '../types';

export const createWebSocketSubjectFactory: TWebSocketSubjectFactoryFactory = (
    createMaskedSubject,
    createWebSocketObservable,
    createWebSocketObserver
) => (webSocket) => {
    return new WebSocketSubject(createMaskedSubject, createWebSocketObservable, createWebSocketObserver, webSocket);
};
