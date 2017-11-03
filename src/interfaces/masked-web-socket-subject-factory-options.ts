import { IMaskableSubject, IParsedJsonObject } from '../interfaces';
import { TStringifyableJsonValue } from '../types';

export interface IMaskedWebSocketSubjectFactoryOptions {

    mask: IParsedJsonObject;

    maskableSubject: IMaskableSubject<TStringifyableJsonValue>;

}
