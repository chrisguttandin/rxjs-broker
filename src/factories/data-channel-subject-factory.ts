import { DataChannelSubject } from '../classes/data-channel-subject';
import { TDataChannelSubjectFactoryFactory, TStringifyableJsonValue } from '../types';

export const createDataChannelSubjectFactory: TDataChannelSubjectFactoryFactory = (
    createDataChannelObservable,
    createDataChannelObserver
) => {
    return <T extends TStringifyableJsonValue>(dataChannel: RTCDataChannel) => {
        return new DataChannelSubject<T>(createDataChannelObservable, createDataChannelObserver, dataChannel);
    };
};
