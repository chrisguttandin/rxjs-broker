import { Observable } from 'rxjs';

export class WebSocketObservable<T> extends Observable<T> {

    constructor (webSocket: WebSocket) {
        super((observer) => {
            const handleCloseEvent = () => observer.complete();
            const handleErrorEvent = <EventListener> (({ error }: ErrorEvent) => observer.error(error));
            const handleMessageEvent = ({ data }: MessageEvent) => {
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
