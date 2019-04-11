import { DataChannelObserver } from '../classes/data-channel-observer';
import { IDataChannel } from '../interfaces';
import { TDataChannelObserverFactory } from '../types';

export const createDataChannelObserver: TDataChannelObserverFactory = <T>(dataChannel: IDataChannel) => {
    return new DataChannelObserver<T>(dataChannel);
};
