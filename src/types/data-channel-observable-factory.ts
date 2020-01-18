import { DataChannelObservable } from '../classes/data-channel-observable';
import { IDataChannelSubjectConfig } from '../interfaces';

export type TDataChannelObservableFactory = <T>(
    dataChannel: RTCDataChannel,
    dataChannelSubjectConfig: IDataChannelSubjectConfig
) => DataChannelObservable<T>;
