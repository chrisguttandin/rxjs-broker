import { DataChannelObservable } from '../classes/data-channel-observable';
import { IDataChannel } from '../interfaces';

export type TDataChannelObservableFactory = <T>(dataChannel: IDataChannel) => DataChannelObservable<T>;
