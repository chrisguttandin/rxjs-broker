import { createDataChannelObserver } from './factories/data-channel-observer';
import { createDataChannelSubjectFactory } from './factories/data-channel-subject-factory';
import { createMaskedSubjectFactory } from './factories/masked-subject-factory';
import { createTransportObservable } from './factories/transport-observable';
import { createWebSocketObserver } from './factories/web-socket-observer';
import { createWebSocketSubjectFactory } from './factories/web-socket-subject-factory';
import { getTypedKeys } from './functions/get-typed-keys';
import { IRemoteSubject, ISubjectConfig } from './interfaces';
import { ConnectionFactory, TStringifyableJsonValue } from './types';

/*
 * @todo Explicitly referencing the barrel file seems to be necessary when enabling the
 * isolatedModules compiler option.
 */
export * from './interfaces/index';
export * from './types/index';

const createDataChannelSubject = createDataChannelSubjectFactory(createDataChannelObserver, createTransportObservable);
const createWebSocketSubject = createWebSocketSubjectFactory(createTransportObservable, createWebSocketObserver);

export const connect = <T extends TStringifyableJsonValue>(url: string, subjectConfig: ISubjectConfig<T> = {}): IRemoteSubject<T> => {
    return createWebSocketSubject(new WebSocket(url), subjectConfig);
};

/**
 * This property is true if the browser supports WebSockets.
 */
export const isSupported = typeof window !== 'undefined' && 'WebSocket' in window;

export const mask = createMaskedSubjectFactory(getTypedKeys);

export const wrap = <T extends TStringifyableJsonValue>(
    connection: RTCDataChannel | WebSocket | ConnectionFactory,
    subjectConfig: ISubjectConfig<T> = {}
): IRemoteSubject<T> => {
    const wrapped = typeof connection === 'function' ? connection() : connection;

    /**
     * Check by duck typing instead of instanceof,
     * so that it will work with different WebSocket or RTCDataChannel implementations
     * such as polyfills or test mocks.
     */
    if (!('send' in wrapped && 'close' in wrapped)) {
        throw new Error('Invalid connection object');
    }

    if ('url' in wrapped) {
        // WebSockets have URLs, data channels don't.
        return createWebSocketSubject(wrapped, subjectConfig);
    }

    return createDataChannelSubject(wrapped, subjectConfig);
};
