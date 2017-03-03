import { IMaskableSubject } from '../interfaces';
import { TJsonValue } from '../types';

export interface IMaskedDataChannelSubjectFactoryOptions {

    mask: TJsonValue;

    maskableSubject: IMaskableSubject;

}
