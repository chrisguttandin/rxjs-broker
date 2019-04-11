import { MaskedWebSocketSubject } from '../classes/masked-web-socket-subject';
import { IMaskableSubject, IParsedJsonObject } from '../interfaces';
import { TStringifyableJsonValue } from './stringifyable-json-value';

export type TMaskedWebSocketSubjectFactory = <T extends TStringifyableJsonValue>(
    mask: IParsedJsonObject,
    maskableSubject: IMaskableSubject<TStringifyableJsonValue>
) => MaskedWebSocketSubject<T>;
