import { TDataChannelObserverFactory } from './data-channel-observer-factory';
import { TDataChannelSubjectFactory } from './data-channel-subject-factory';
import { TTransportObservableFactory } from './transport-observable-factory';

export type TDataChannelSubjectFactoryFactory = (
    createDataChannelObserver: TDataChannelObserverFactory,
    createTransportObservable: TTransportObservableFactory
) => TDataChannelSubjectFactory;
