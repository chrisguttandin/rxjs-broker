import { AnonymousSubject } from 'rxjs/internal/Subject'; // tslint:disable-line no-submodule-imports rxjs-no-internal
import { MaskedWebSocketSubjectFactory } from '../factories/masked-web-socket-subject';
import { IMaskableSubject, IParsedJsonObject, IWebSocketSubjectOptions } from '../interfaces';
import { TStringifyableJsonValue } from '../types';
import { MaskedWebSocketSubject } from './masked-web-socket-subject';

export class WebSocketSubject extends AnonymousSubject<TStringifyableJsonValue> implements IMaskableSubject<TStringifyableJsonValue> {

    private _maskedWebSocketSubjectFactory: MaskedWebSocketSubjectFactory;

    private _webSocket: WebSocket;

    constructor ({
        maskedWebSocketSubjectFactory, webSocket, webSocketObservableFactory, webSocketObserverFactory
    }: IWebSocketSubjectOptions) {
        const observable = webSocketObservableFactory.create<TStringifyableJsonValue>({ webSocket });

        const observer = webSocketObserverFactory.create<TStringifyableJsonValue>({ webSocket });

        super(observer, observable);

        this._maskedWebSocketSubjectFactory = maskedWebSocketSubjectFactory;
        this._webSocket = webSocket;
    }

    public close () {
        this._webSocket.close();
    }

    public mask <TMessage extends TStringifyableJsonValue> (mask: IParsedJsonObject): MaskedWebSocketSubject<TMessage> {
        return this._maskedWebSocketSubjectFactory.create<TMessage>({ maskableSubject: this, mask });
    }

    public send (message: TStringifyableJsonValue) {
        const { destination }: any = this;

        if (!this.isStopped) {
            return destination.send(message);
        }
    }

}
