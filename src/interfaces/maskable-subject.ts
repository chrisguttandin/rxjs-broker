import { AnonymousSubject } from 'rxjs/Subject';
import { TParsedJsonValue, TStringifyableJsonValue } from '../types';

export interface IMaskableSubject<TMessage extends TStringifyableJsonValue> extends AnonymousSubject<TMessage> {

    close (): void;

    mask<TMakedMessage extends TStringifyableJsonValue> (mask: TParsedJsonValue): IMaskableSubject<TMakedMessage>;

    send (message: TMessage): Promise<any>;

}
