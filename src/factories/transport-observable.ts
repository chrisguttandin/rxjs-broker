import { TransportObservable } from '../classes/transport-observable';
import { ISubjectConfig } from '../interfaces';

export const createTransportObservable = <T extends RTCDataChannel | WebSocket, U>(transport: T, subjectConfig: ISubjectConfig) => {
    return new TransportObservable<T, U>(transport, subjectConfig);
};
