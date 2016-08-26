import { Observable } from 'rxjs/Observable';

class WebSocketObservable extends Observable {

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

export class WebSocketObservableFactory {

    create ({ webSocket }) { // eslint-disable-line class-methods-use-this
        return new WebSocketObservable({ webSocket });
    }

}
