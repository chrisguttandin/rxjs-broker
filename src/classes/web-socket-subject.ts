import { AnonymousSubject } from 'rxjs/internal/Subject'; // tslint:disable-line no-submodule-imports rxjs-no-internal
import { IMaskableSubject, IParsedJsonObject } from '../interfaces';
import { TMaskedSubjectFactory, TStringifyableJsonValue, TWebSocketObservableFactory, TWebSocketObserverFactory } from '../types';
import { MaskedSubject } from './masked-subject';

export class WebSocketSubject extends AnonymousSubject<TStringifyableJsonValue> implements IMaskableSubject<TStringifyableJsonValue> {

    private _createMaskedSubject: TMaskedSubjectFactory;

    private _webSocket: WebSocket;

    constructor (
        createMaskedSubject: TMaskedSubjectFactory,
        createWebSocketObservable: TWebSocketObservableFactory,
        createWebSocketObserver: TWebSocketObserverFactory,
        webSocket: WebSocket
    ) {
        const observable = createWebSocketObservable<TStringifyableJsonValue>(webSocket);

        const observer = createWebSocketObserver<TStringifyableJsonValue>(webSocket);

        super(observer, observable);

        this._createMaskedSubject = createMaskedSubject;
        this._webSocket = webSocket;
    }

    public close () {
        this._webSocket.close();
    }

    public mask <TMessage extends TStringifyableJsonValue> (mask: IParsedJsonObject): MaskedSubject<TMessage> {
        return this._createMaskedSubject<TMessage>(mask, this);
    }

    public send (message: TStringifyableJsonValue) {
        const { destination }: any = this;

        if (!this.isStopped) {
            return destination.send(message);
        }
    }

}
