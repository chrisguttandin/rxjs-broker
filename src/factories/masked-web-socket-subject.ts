import { MaskedWebSocketSubject } from '../classes/masked-web-socket-subject';
import { IMaskableSubject, IParsedJsonObject } from '../interfaces';
import { TMaskedWebSocketSubjectFactory, TStringifyableJsonValue } from '../types';

export const createMaskedWebSocketSubject: TMaskedWebSocketSubjectFactory = <T extends TStringifyableJsonValue>(
    mask: IParsedJsonObject,
    maskableSubject: IMaskableSubject<TStringifyableJsonValue>
) => {
    return new MaskedWebSocketSubject<T>(mask, maskableSubject);
};
