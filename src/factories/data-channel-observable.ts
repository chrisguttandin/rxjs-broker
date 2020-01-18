import { DataChannelObservable } from '../classes/data-channel-observable';
import { IDataChannelSubjectConfig } from '../interfaces';

export const createDataChannelObservable = <T>(dataChannel: RTCDataChannel, dataChannelSubjectConfig: IDataChannelSubjectConfig) => {
    return new DataChannelObservable<T>(dataChannel, dataChannelSubjectConfig);
};
