import { DataChannelObservable } from '../classes/data-channel-observable';
import { TDataChannelObservableFactory } from '../types';

export const createDataChannelObservable: TDataChannelObservableFactory = <T>(dataChannel: RTCDataChannel) => {
    return new DataChannelObservable<T>(dataChannel);
};
