import { DataChannelSubject } from '../classes/data-channel-subject';
import { ISubjectConfig } from '../interfaces';
import { TStringifyableJsonValue } from './stringifyable-json-value';

export type TDataChannelSubjectFactory = <T extends TStringifyableJsonValue>(
    dataChannel: RTCDataChannel,
    subjectConfig: ISubjectConfig
) => DataChannelSubject<T>;
