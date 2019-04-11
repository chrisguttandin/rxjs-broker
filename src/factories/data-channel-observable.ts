import { DataChannelObservable } from '../classes/data-channel-observable';
import { IDataChannel } from '../interfaces';
import { TDataChannelObservableFactory } from '../types';

export const createDataChannelObservable: TDataChannelObservableFactory = <T>(dataChannel: IDataChannel) => {
    return new DataChannelObservable<T>(dataChannel);
};
