import { Observer } from 'rxjs';

export class WebSocketObserver<T> implements Observer<T> {
    private _webSocket: WebSocket;

    constructor(webSocket: WebSocket) {
        this._webSocket = webSocket;
    }

    public complete(): void {
        // This method does nothing because the DataChannel can be closed separately.
    }

    public error(err: Error): void {
        throw err;
    }

    public next(value: T): void {
        this.send(value);
    }

    public send(message: T): Promise<void> {
        const stringifiedMessage = JSON.stringify(message);

        if (this._webSocket.readyState === WebSocket.OPEN) {
            this._webSocket.send(stringifiedMessage);

            return Promise.resolve();
        }

        if (this._webSocket.readyState === WebSocket.CLOSING) {
            return Promise.reject(new Error('The WebSocket is already closing.'));
        }

        if (this._webSocket.readyState === WebSocket.CLOSED) {
            return Promise.reject(new Error('The WebSocket is already closed.'));
        }

        return new Promise((resolve, reject) => {
            const handleErrorEvent = () => {
                this._webSocket.removeEventListener('error', handleErrorEvent);
                this._webSocket.removeEventListener('open', handleOpenEvent); // tslint:disable-line:no-use-before-declare

                reject(new Error('Unknown WebSocket Error'));
            };

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
