import { DataChannelSubject } from '../classes/data-channel-subject';
import { TDataChannelSubjectFactoryFactory } from '../types';

export const createDataChannelSubjectFactory: TDataChannelSubjectFactoryFactory = (
    createDataChannelObservable,
    createDataChannelObserver,
    createMaskedSubject
) => (dataChannel) => {
    return new DataChannelSubject(createDataChannelObservable, createDataChannelObserver, createMaskedSubject, dataChannel);
};
