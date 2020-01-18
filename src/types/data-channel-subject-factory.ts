import { DataChannelSubject } from '../classes/data-channel-subject';
import { IDataChannelSubjectConfig } from '../interfaces';
import { TStringifyableJsonValue } from './stringifyable-json-value';

export type TDataChannelSubjectFactory = <T extends TStringifyableJsonValue>(
    dataChannel: RTCDataChannel,
    dataChannelSubjectConfig: IDataChannelSubjectConfig
) => DataChannelSubject<T>;
