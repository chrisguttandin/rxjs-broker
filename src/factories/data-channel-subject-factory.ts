import { DataChannelSubject } from '../classes/data-channel-subject';
import { ISubjectConfig } from '../interfaces';
import { TDataChannelSubjectFactoryFactory, TStringifyableJsonValue } from '../types';

export const createDataChannelSubjectFactory: TDataChannelSubjectFactoryFactory = (
    createDataChannelObserver,
    createTransportObservable
) => {
    return <T extends TStringifyableJsonValue>(dataChannel: RTCDataChannel, subjectConfig: ISubjectConfig<T>) => {
        return new DataChannelSubject<T>(createDataChannelObserver, createTransportObservable, dataChannel, subjectConfig);
    };
};
