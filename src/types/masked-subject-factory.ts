import { MaskedSubject } from '../classes/masked-subject';
import { IMaskableSubject, IParsedJsonObject } from '../interfaces';
import { TStringifyableJsonValue } from './stringifyable-json-value';

export type TMaskedSubjectFactory = <T extends TStringifyableJsonValue>(
    mask: IParsedJsonObject,
    maskableSubject: IMaskableSubject<TStringifyableJsonValue>
) => MaskedSubject<T>;
