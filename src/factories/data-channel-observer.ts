import { DataChannelObserver } from '../classes/data-channel-observer';

export const createDataChannelObserver = <T>(dataChannel: RTCDataChannel) => {
    return new DataChannelObserver<T>(dataChannel);
};
