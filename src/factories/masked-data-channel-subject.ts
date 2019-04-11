import { MaskedDataChannelSubject } from '../classes/masked-data-channel-subject';
import { IMaskedDataChannelSubjectFactoryOptions } from '../interfaces';
import { TStringifyableJsonValue } from '../types';

export class MaskedDataChannelSubjectFactory {

    public create<TMessage extends TStringifyableJsonValue>
            ({ mask, maskableSubject }: IMaskedDataChannelSubjectFactoryOptions): MaskedDataChannelSubject<TMessage> {
        return new MaskedDataChannelSubject<TMessage>({ mask, maskableSubject });
    }

}

export const MASKED_DATA_CHANNEL_SUBJECT_FACTORY_PROVIDER = { deps: [ ], provide: MaskedDataChannelSubjectFactory };
