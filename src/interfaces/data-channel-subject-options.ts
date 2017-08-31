import { DataChannelObservableFactory } from '../factories/data-channel-observable';
import { DataChannelObserverFactory } from '../factories/data-channel-observer';
import { MaskedDataChannelSubjectFactory } from '../factories/masked-data-channel-subject';
import { IDataChannelSubjectFactoryOptions } from './data-channel-subject-factory-options';

export interface IDataChannelSubjectOptions extends IDataChannelSubjectFactoryOptions {

    dataChannelObservableFactory: DataChannelObservableFactory;

    dataChannelObserverFactory: DataChannelObserverFactory;

    maskedDataChannelSubjectFactory: MaskedDataChannelSubjectFactory;

}
