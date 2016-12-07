import { Injectable } from '@angular/core';

export class WebSocketObserver {

    private _webSocket;

    constructor ({ webSocket }) {
        this._webSocket = webSocket;
    }

    public next (value) {
        this.send(value);
    }

    public send (message) {
        message = JSON.stringify(message);

        if (this._webSocket.readyState === WebSocket.OPEN) {
            return Promise.resolve(this._webSocket.send(message));
        }

        return new Promise((resolve, reject) => {
            const handleErrorEvent = ({ error }) => {
                this._webSocket.removeEventListener('error', handleErrorEvent);
                this._webSocket.removeEventListener('open', handleOpenEvent); // tslint:disable-line:no-use-before-declare

                reject(error);
            };

            const handleOpenEvent = () => {
                this._webSocket.removeEventListener('error', handleErrorEvent);
                this._webSocket.removeEventListener('open', handleOpenEvent);

                resolve(this._webSocket.send(message));
            };

            this._webSocket.addEventListener('error', handleErrorEvent);
            this._webSocket.addEventListener('open', handleOpenEvent);
        });
    }

}

@Injectable()
export class WebSocketObserverFactory {

    public create ({ webSocket }) {
        return new WebSocketObserver({ webSocket });
    }

}
