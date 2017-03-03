import { AnonymousSubject } from 'rxjs/Subject';
import { TJsonValue } from '../types';

export interface IMaskableSubject extends AnonymousSubject<TJsonValue> {

    close (): void;

    mask (mask: TJsonValue): IMaskableSubject;

    send (message: TJsonValue): Promise<any>;

}
