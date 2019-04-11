import { DataChannelSubject } from '../classes/data-channel-subject';

export type TDataChannelSubjectFactory = (dataChannel: RTCDataChannel) => DataChannelSubject;
