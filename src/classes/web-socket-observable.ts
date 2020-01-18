import { Observable } from 'rxjs';
import { IWebSocketSubjectConfig } from '../interfaces';

export class WebSocketObservable<T> extends Observable<T> { // tslint:disable-line rxjs-no-subclass

    constructor (webSocket: WebSocket, { openObserver }: IWebSocketSubjectConfig) {
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
            const handleOpenEvent = () => {
                if (openObserver !== undefined) {
                    openObserver.next();
                }
            };

            webSocket.addEventListener('close', handleCloseEvent);
            webSocket.addEventListener('error', handleErrorEvent);
            webSocket.addEventListener('message', handleMessageEvent);
            webSocket.addEventListener('open', handleOpenEvent);

            return () => {
                webSocket.removeEventListener('close', handleCloseEvent);
                webSocket.removeEventListener('error', handleErrorEvent);
                webSocket.removeEventListener('message', handleMessageEvent);
                webSocket.removeEventListener('open', handleOpenEvent);
            };
        });
    }

}
