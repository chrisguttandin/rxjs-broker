import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export class WebSocketObservable<T> extends Observable<T> {

    constructor ({ webSocket }) {
        super((observer) => {
            const handleCloseEvent = () => observer.complete();
            const handleErrorEvent = ({ error }) => observer.error(error);
            const handleMessageEvent = ({ data }) => {
                try {
                    observer.next(JSON.parse(data));
                } catch (err) {
                    observer.next(data);
                }
            };

            webSocket.addEventListener('close', handleCloseEvent);
            webSocket.addEventListener('error', handleErrorEvent);
            webSocket.addEventListener('message', handleMessageEvent);

            return () => {
                webSocket.removeEventListener('close', handleCloseEvent);
                webSocket.removeEventListener('error', handleErrorEvent);
                webSocket.removeEventListener('message', handleMessageEvent);
            };
        });
    }

}

@Injectable()
export class WebSocketObservableFactory {

    public create ({ webSocket }) {
        return new WebSocketObservable({ webSocket });
    }

}
