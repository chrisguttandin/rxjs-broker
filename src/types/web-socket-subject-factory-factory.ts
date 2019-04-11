import { TWebSocketObservableFactory } from './web-socket-observable-factory';
import { TWebSocketObserverFactory } from './web-socket-observer-factory';
import { TWebSocketSubjectFactory } from './web-socket-subject-factory';

export type TWebSocketSubjectFactoryFactory = (
    createWebSocketObservable: TWebSocketObservableFactory,
    createWebSocketObserver: TWebSocketObserverFactory
) => TWebSocketSubjectFactory;
