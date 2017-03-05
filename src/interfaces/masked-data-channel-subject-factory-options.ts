import { IMaskableSubject } from '../interfaces';
import { TParsedJsonValue, TStringifyableJsonValue } from '../types';

export interface IMaskedDataChannelSubjectFactoryOptions {

    mask: TParsedJsonValue;

    maskableSubject: IMaskableSubject<TStringifyableJsonValue>;

}
