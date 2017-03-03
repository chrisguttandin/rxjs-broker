import { IMaskableSubject } from '../interfaces';
import { TJsonValue } from '../types';

export interface IMaskedWebSocketSubjectFactoryOptions {

    mask: TJsonValue;

    maskableSubject: IMaskableSubject;

}
