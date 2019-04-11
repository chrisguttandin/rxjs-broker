import { DataChannelObserver } from '../classes/data-channel-observer';

export type TDataChannelObserverFactory = <T>(dataChannel: RTCDataChannel) => DataChannelObserver<T>;
