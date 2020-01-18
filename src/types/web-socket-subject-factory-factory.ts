import { TTransportObservableFactory } from './transport-observable-factory';
import { TWebSocketObserverFactory } from './web-socket-observer-factory';
import { TWebSocketSubjectFactory } from './web-socket-subject-factory';

export type TWebSocketSubjectFactoryFactory = (
    createTransportObservable: TTransportObservableFactory,
    createWebSocketObserver: TWebSocketObserverFactory
) => TWebSocketSubjectFactory;
