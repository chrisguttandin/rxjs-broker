import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { filter } from 'rxjs/operator/filter';
import { map } from 'rxjs/operator/map';

class WebSocketSubject extends Subject {

    constructor ({ type, webSocket }) {
        super();

        this._observable = Observable
            .create((observer) => {
                const close = () => observer.complete();
                const error = (event) => observer.error(event);
                const message = (event) => observer.next(event);

                this._webSocket.addEventListener('close', close);
                this._webSocket.addEventListener('error', error);
                this._webSocket.addEventListener('message', message);

                return () => {
                    this._webSocket.removeEventListener('close', close);
                    this._webSocket.removeEventListener('error', error);
                    this._webSocket.removeEventListener('message', message);
                };
            })
            ::map(({ data }) => data)
            ::map((data) => JSON.parse(data))
            ::filter(({ type }) => type === this._type)
            ::map(({ message }) => message);
        this._webSocket = webSocket;
        this._type = type;
    }

    next (message) {
        var data = JSON.stringify({ message, type: this._type });

        this._webSocket.send(data);
    }

    async send (message) {
        this.next(message);
    }

    subscribe (subscriber) {
        return this._observable
            .subscribe(subscriber);
    }

}

export class WebSocketSubjectFactory {

    create ({ type, webSocket }) {
        return new WebSocketSubject({ type, webSocket });
    }

}
