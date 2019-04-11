import { MaskedSubject } from '../classes/masked-subject';
import { IMaskableSubject, IParsedJsonObject } from '../interfaces';
import { TMaskedSubjectFactory, TStringifyableJsonValue } from '../types';

export const createMaskedSubject: TMaskedSubjectFactory = <T extends TStringifyableJsonValue>(
    mask: IParsedJsonObject,
    maskableSubject: IMaskableSubject<TStringifyableJsonValue>
) => {
    return new MaskedSubject<T>(mask, maskableSubject);
};
