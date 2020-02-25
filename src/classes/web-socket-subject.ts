import { AnonymousSubject } from 'rxjs/internal/Subject'; // tslint:disable-line rxjs-no-compat no-submodule-imports rxjs-no-internal
import { IRemoteSubject, ISubjectConfig } from '../interfaces';
import { TStringifyableJsonValue, TTransportObservableFactory, TWebSocketObserverFactory } from '../types';

export class WebSocketSubject<T extends TStringifyableJsonValue> extends AnonymousSubject<T> implements IRemoteSubject<T> {

    private _webSocket: WebSocket;

    constructor (
        createTransportObservable: TTransportObservableFactory,
        createWebSocketObserver: TWebSocketObserverFactory,
        webSocket: WebSocket,
        subjectConfig: ISubjectConfig
    ) {
        const observable = createTransportObservable<WebSocket, T>(webSocket, subjectConfig);
        const observer = createWebSocketObserver<T>(webSocket);

        super(observer, observable);

        this._webSocket = webSocket;
    }

    public close (): void {
        this._webSocket.close();
    }

    public send (message: T): Promise<void> {
        const { destination }: any = this;

        if (!this.isStopped) {
            return destination.send(message);
        }

        return Promise.resolve();
    }

}
