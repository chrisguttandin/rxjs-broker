import { DataChannelObserver } from '../classes/data-channel-observer';
import { IDataChannel } from '../interfaces';

export type TDataChannelObserverFactory = <T>(dataChannel: IDataChannel) => DataChannelObserver<T>;
