import { IMaskableSubject, IParsedJsonObject } from '../interfaces';
import { TStringifyableJsonValue } from '../types';

export interface IMaskedDataChannelSubjectFactoryOptions {

    mask: IParsedJsonObject;

    maskableSubject: IMaskableSubject<TStringifyableJsonValue>;

}
