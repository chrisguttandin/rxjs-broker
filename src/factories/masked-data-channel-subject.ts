import { MaskedDataChannelSubject } from '../classes/masked-data-channel-subject';
import { IMaskableSubject, IParsedJsonObject } from '../interfaces';
import { TMaskedDataChannelSubjectFactory, TStringifyableJsonValue } from '../types';

export const createMaskedDataChannelSubject: TMaskedDataChannelSubjectFactory = <T extends TStringifyableJsonValue>(
    mask: IParsedJsonObject,
    maskableSubject: IMaskableSubject<TStringifyableJsonValue>
) => {
    return new MaskedDataChannelSubject<T>(mask, maskableSubject);
};
