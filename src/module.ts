import { createDataChannelObservable } from './factories/data-channel-observable';
import { createDataChannelObserver } from './factories/data-channel-observer';
import { createDataChannelSubjectFactory } from './factories/data-channel-subject-factory';
import { createMaskedSubject } from './factories/masked-subject';
import { createWebSocketObservable } from './factories/web-socket-observable';
import { createWebSocketObserver } from './factories/web-socket-observer';
import { createWebSocketSubjectFactory } from './factories/web-socket-subject-factory';
import { IMaskableSubject } from './interfaces';
import { TStringifyableJsonValue } from './types';

export * from './interfaces';
export * from './types';

const createDataChannelSubject = createDataChannelSubjectFactory(
    createDataChannelObservable,
    createDataChannelObserver,
    createMaskedSubject
);
const createWebSocketSubject = createWebSocketSubjectFactory(
    createMaskedSubject,
    createWebSocketObservable,
    createWebSocketObserver
);

export const connect = (url: string): IMaskableSubject<TStringifyableJsonValue> => {
    return createWebSocketSubject(new WebSocket(url));
};

/**
 * This property is true if the browser supports WebSockets.
 */
export const isSupported = (typeof window !== 'undefined' && 'WebSocket' in window);

export const wrap = (dataChannel: RTCDataChannel): IMaskableSubject<TStringifyableJsonValue> => {
    return createDataChannelSubject(dataChannel);
};
