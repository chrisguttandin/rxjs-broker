import { DataChannelSubject } from '../classes/data-channel-subject';
import { TStringifyableJsonValue } from './stringifyable-json-value';

export type TDataChannelSubjectFactory = <T extends TStringifyableJsonValue>(dataChannel: RTCDataChannel) => DataChannelSubject<T>;
