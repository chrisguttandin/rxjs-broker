import { AnonymousSubject } from 'rxjs/internal/Subject'; // tslint:disable-line no-submodule-imports rxjs-no-internal
import { IRemoteSubject } from '../interfaces';
import { TStringifyableJsonValue, TWebSocketObservableFactory, TWebSocketObserverFactory } from '../types';

export class WebSocketSubject<T extends TStringifyableJsonValue> extends AnonymousSubject<T> implements IRemoteSubject<T> {

    private _webSocket: WebSocket;

    constructor (
        createWebSocketObservable: TWebSocketObservableFactory,
        createWebSocketObserver: TWebSocketObserverFactory,
        webSocket: WebSocket
    ) {
        const observable = createWebSocketObservable<T>(webSocket);
        const observer = createWebSocketObserver<T>(webSocket);

        super(observer, observable);

        this._webSocket = webSocket;
    }

    public close () {
        this._webSocket.close();
    }

    public send (message: TStringifyableJsonValue) {
        const { destination }: any = this;

        if (!this.isStopped) {
            return destination.send(message);
        }
    }

}
