import { MaskedDataChannelSubject } from '../classes/masked-data-channel-subject';
import { IMaskableSubject, IParsedJsonObject } from '../interfaces';
import { TStringifyableJsonValue } from './stringifyable-json-value';

export type TMaskedDataChannelSubjectFactory = <T extends TStringifyableJsonValue>(
    mask: IParsedJsonObject,
    maskableSubject: IMaskableSubject<TStringifyableJsonValue>
) => MaskedDataChannelSubject<T>;
