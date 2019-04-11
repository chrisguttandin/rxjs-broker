import { DataChannelObservable } from '../classes/data-channel-observable';

export type TDataChannelObservableFactory = <T>(dataChannel: RTCDataChannel) => DataChannelObservable<T>;
