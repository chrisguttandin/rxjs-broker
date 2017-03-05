import { IMaskableSubject } from '../interfaces';
import { TParsedJsonValue, TStringifyableJsonValue } from '../types';

export interface IMaskedWebSocketSubjectFactoryOptions {

    mask: TParsedJsonValue;

    maskableSubject: IMaskableSubject<TStringifyableJsonValue>;

}
