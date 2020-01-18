import { createDataChannelObservable } from './factories/data-channel-observable';
import { createDataChannelObserver } from './factories/data-channel-observer';
import { createDataChannelSubjectFactory } from './factories/data-channel-subject-factory';
import { createMaskedSubjectFactory } from './factories/masked-subject-factory';
import { createWebSocketObservable } from './factories/web-socket-observable';
import { createWebSocketObserver } from './factories/web-socket-observer';
import { createWebSocketSubjectFactory } from './factories/web-socket-subject-factory';
import { getTypedKeys } from './functions/get-typed-keys';
import { IRemoteSubject, IWebSocketSubjectConfig } from './interfaces';
import { TStringifyableJsonValue } from './types';

/*
 * @todo Explicitly referencing the barrel file seems to be necessary when enabling the
 * isolatedModules compiler option.
 */
export * from './interfaces/index';
export * from './types/index';

const createDataChannelSubject = createDataChannelSubjectFactory(
    createDataChannelObservable,
    createDataChannelObserver
);
const createWebSocketSubject = createWebSocketSubjectFactory(
    createWebSocketObservable,
    createWebSocketObserver
);

export const connect = <T extends TStringifyableJsonValue>(
    url: string,
    webSocketSubjectConfig: IWebSocketSubjectConfig = { }
): IRemoteSubject<T> => {
    return createWebSocketSubject(new WebSocket(url), webSocketSubjectConfig);
};

/**
 * This property is true if the browser supports WebSockets.
 */
export const isSupported = (typeof window !== 'undefined' && 'WebSocket' in window);

export const mask = createMaskedSubjectFactory(getTypedKeys);

export const wrap = <T extends TStringifyableJsonValue>(dataChannel: RTCDataChannel): IRemoteSubject<T> => {
    return createDataChannelSubject(dataChannel);
};
