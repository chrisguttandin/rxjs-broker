import { DataChannelSubject } from '../classes/data-channel-subject';
import { TDataChannelSubjectFactoryFactory } from '../types';

export const createDataChannelSubjectFactory: TDataChannelSubjectFactoryFactory = (
    createDataChannelObservable,
    createDataChannelObserver,
    createMaskedDataChannelSubject
) => (dataChannel) => {
    return new DataChannelSubject(createDataChannelObservable, createDataChannelObserver, createMaskedDataChannelSubject, dataChannel);
};
