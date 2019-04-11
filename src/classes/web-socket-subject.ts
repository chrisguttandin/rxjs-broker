import { AnonymousSubject } from 'rxjs/internal/Subject'; // tslint:disable-line no-submodule-imports rxjs-no-internal
import { IMaskableSubject, IParsedJsonObject } from '../interfaces';
import { TMaskedWebSocketSubjectFactory, TStringifyableJsonValue, TWebSocketObservableFactory, TWebSocketObserverFactory } from '../types';
import { MaskedWebSocketSubject } from './masked-web-socket-subject';

export class WebSocketSubject extends AnonymousSubject<TStringifyableJsonValue> implements IMaskableSubject<TStringifyableJsonValue> {

    private _createMaskedWebSocketSubject: TMaskedWebSocketSubjectFactory;

    private _webSocket: WebSocket;

    constructor (
        createWebSocketObservable: TWebSocketObservableFactory,
        createWebSocketObserver: TWebSocketObserverFactory,
        createMaskedWebSocketSubject: TMaskedWebSocketSubjectFactory,
        webSocket: WebSocket
    ) {
        const observable = createWebSocketObservable<TStringifyableJsonValue>(webSocket);

        const observer = createWebSocketObserver<TStringifyableJsonValue>(webSocket);

        super(observer, observable);

        this._createMaskedWebSocketSubject = createMaskedWebSocketSubject;
        this._webSocket = webSocket;
    }

    public close () {
        this._webSocket.close();
    }

    public mask <TMessage extends TStringifyableJsonValue> (mask: IParsedJsonObject): MaskedWebSocketSubject<TMessage> {
        return this._createMaskedWebSocketSubject<TMessage>(mask, this);
    }

    public send (message: TStringifyableJsonValue) {
        const { destination }: any = this;

        if (!this.isStopped) {
            return destination.send(message);
        }
    }

}
