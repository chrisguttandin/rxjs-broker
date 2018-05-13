import { AnonymousSubject } from 'rxjs/internal/Subject'; // tslint:disable-line no-submodule-imports rxjs-no-internal
import { TParsedJsonValue, TStringifyableJsonValue } from '../types';

export interface IMaskableSubject<TMessage extends TStringifyableJsonValue> extends AnonymousSubject<TMessage> {

    close (): void;

    mask<TMakedMessage extends TStringifyableJsonValue> (mask: TParsedJsonValue): IMaskableSubject<TMakedMessage>;

    send (message: TMessage): Promise<any>;

}
