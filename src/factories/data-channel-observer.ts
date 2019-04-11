import { DataChannelObserver } from '../classes/data-channel-observer';
import { TDataChannelObserverFactory } from '../types';

export const createDataChannelObserver: TDataChannelObserverFactory = <T>(dataChannel: RTCDataChannel) => {
    return new DataChannelObserver<T>(dataChannel);
};
