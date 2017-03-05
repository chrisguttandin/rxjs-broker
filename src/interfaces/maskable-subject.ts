import { AnonymousSubject } from 'rxjs/Subject';
import { TParsedJsonValue, TStringifyableJsonValue } from '../types';

export interface IMaskableSubject<TMessage extends TStringifyableJsonValue> extends AnonymousSubject<TMessage> {

    close (): void;

    mask<TMessage extends TStringifyableJsonValue> (mask: TParsedJsonValue): IMaskableSubject<TMessage>;

    send (message: TMessage): Promise<any>;

}
