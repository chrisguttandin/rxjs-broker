import { MaskedWebSocketSubject } from '../classes/masked-web-socket-subject';
import { IMaskedWebSocketSubjectFactoryOptions } from '../interfaces';
import { TStringifyableJsonValue } from '../types';

export class MaskedWebSocketSubjectFactory {

    public create<TMessage extends TStringifyableJsonValue>
            ({ mask, maskableSubject }: IMaskedWebSocketSubjectFactoryOptions): MaskedWebSocketSubject<TMessage> {
        return new MaskedWebSocketSubject<TMessage>({ mask, maskableSubject });
    }

}

export const MASKED_WEB_SOCKET_SUBJECT_FACTORY_PROVIDER = { deps: [ ], provide: MaskedWebSocketSubjectFactory };
