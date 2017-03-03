import { DataChannelObservableFactory, DataChannelObserverFactory, MaskedDataChannelSubjectFactory } from '../factories';
import { IDataChannelSubjectFactoryOptions } from './data-channel-subject-factory-options';

export interface IDataChannelSubjectOptions extends IDataChannelSubjectFactoryOptions {

    dataChannelObservableFactory: DataChannelObservableFactory;

    dataChannelObserverFactory: DataChannelObserverFactory;

    maskedDataChannelSubjectFactory: MaskedDataChannelSubjectFactory;

}
