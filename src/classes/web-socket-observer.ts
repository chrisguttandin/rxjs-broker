import { Observer } from 'rxjs';
import { IWebSocketObserverFactoryOptions } from '../interfaces';

export class WebSocketObserver<T> implements Observer<T> {

    private _webSocket: WebSocket;

    constructor ({ webSocket }: IWebSocketObserverFactoryOptions) {
        this._webSocket = webSocket;
    }

    public complete () {
        // This method does nothing because the DataChannel can be closed separately.
    }

    public error (err: Error) {
        throw err;
    }

    public next (value: T) {
        this.send(value);
    }

    public send (message: T) {
        const stringifiedMessage = JSON.stringify(message);

        if (this._webSocket.readyState === WebSocket.OPEN) {
            this._webSocket.send(stringifiedMessage);

            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const handleErrorEvent = <EventListener> (({ error }: ErrorEvent) => {
                this._webSocket.removeEventListener('error', handleErrorEvent);
                this._webSocket.removeEventListener('open', handleOpenEvent); // tslint:disable-line:no-use-before-declare

                reject(error);
            });

            const handleOpenEvent = () => {
                this._webSocket.removeEventListener('error', handleErrorEvent);
                this._webSocket.removeEventListener('open', handleOpenEvent);

                this._webSocket.send(stringifiedMessage);

                resolve();
            };

            this._webSocket.addEventListener('error', handleErrorEvent);
            this._webSocket.addEventListener('open', handleOpenEvent);
        });
    }

}
