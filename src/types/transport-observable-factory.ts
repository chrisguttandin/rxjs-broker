import { TransportObservable } from '../classes/transport-observable';
import { ISubjectConfig } from '../interfaces';

export type TTransportObservableFactory = <T extends RTCDataChannel | WebSocket, U>(
    transport: T,
    subjectConfig: ISubjectConfig<U>
) => TransportObservable<T, U>;
