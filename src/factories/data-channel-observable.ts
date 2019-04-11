import { DataChannelObservable } from '../classes/data-channel-observable';

export const createDataChannelObservable = <T>(dataChannel: RTCDataChannel) => {
    return new DataChannelObservable<T>(dataChannel);
};
