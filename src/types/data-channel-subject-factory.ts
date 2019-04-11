import { DataChannelSubject } from '../classes/data-channel-subject';
import { IDataChannel } from '../interfaces';

export type TDataChannelSubjectFactory = (dataChannel: IDataChannel) => DataChannelSubject;
