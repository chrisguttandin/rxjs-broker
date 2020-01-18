import { DataChannelSubject } from '../classes/data-channel-subject';
import { IDataChannelSubjectConfig } from '../interfaces';
import { TDataChannelSubjectFactoryFactory, TStringifyableJsonValue } from '../types';

export const createDataChannelSubjectFactory: TDataChannelSubjectFactoryFactory = (
    createDataChannelObservable,
    createDataChannelObserver
) => {
    return <T extends TStringifyableJsonValue>(dataChannel: RTCDataChannel, dataChannelSubjectConfig: IDataChannelSubjectConfig) => {
        return new DataChannelSubject<T>(createDataChannelObservable, createDataChannelObserver, dataChannel, dataChannelSubjectConfig);
    };
};
