import { Observer } from 'rxjs';

const BUFFERED_AMOUNT_LOW_THRESHOLD = 2048;

export class DataChannelObserver<T> implements Observer<T> {

    private _dataChannel: RTCDataChannel;

    private _isSupportingBufferedAmountLowThreshold: boolean;

    constructor (dataChannel: RTCDataChannel) {
        this._dataChannel = dataChannel;

        if (typeof dataChannel.bufferedAmountLowThreshold === 'number') {
            this._isSupportingBufferedAmountLowThreshold = true;

            if (dataChannel.bufferedAmountLowThreshold === 0) {
                dataChannel.bufferedAmountLowThreshold = BUFFERED_AMOUNT_LOW_THRESHOLD;
            }
        } else {
            this._isSupportingBufferedAmountLowThreshold = false;
        }
    }

    public complete (): void {
        // This method does nothing because the DataChannel can be closed separately.
    }

    public error (err: Error): void {
        throw err;
    }

    public next (value: T): void {
        this.send(value);
    }

    public send (message: T): Promise<void> {
        if (this._dataChannel.readyState === 'open') {
            if (this._isSupportingBufferedAmountLowThreshold &&
                    this._dataChannel.bufferedAmount > this._dataChannel.bufferedAmountLowThreshold) {
                return new Promise((resolve, reject) => {
                    const handleBufferedAmountLowEvent = () => {
                        this._dataChannel.removeEventListener('bufferedamountlow', handleBufferedAmountLowEvent);
                        this._dataChannel.removeEventListener('error', handleErrorEvent); // tslint:disable-line:no-use-before-declare

                        this.send(message);

                        resolve();
                    };

                    const handleErrorEvent = <EventListener> (({ error }: ErrorEvent) => {
                        this._dataChannel.removeEventListener('bufferedamountlow', handleBufferedAmountLowEvent);
                        this._dataChannel.removeEventListener('error', handleErrorEvent);

                        reject(error);
                    });

                    this._dataChannel.addEventListener('bufferedamountlow', handleBufferedAmountLowEvent);
                    this._dataChannel.addEventListener('error', handleErrorEvent);
                });
            }

            return Promise.resolve(this._dataChannel.send(JSON.stringify(message)));
        }

        return new Promise((resolve, reject) => {
            const handleErrorEvent = <EventListener> (({ error }: ErrorEvent) => {
                this._dataChannel.removeEventListener('error', handleErrorEvent);
                this._dataChannel.removeEventListener('open', handleOpenEvent); // tslint:disable-line:no-use-before-declare

                reject(error);
            });

            const handleOpenEvent = () => {
                this._dataChannel.removeEventListener('error', handleErrorEvent);
                this._dataChannel.removeEventListener('open', handleOpenEvent);

                resolve(this.send(message));
            };

            this._dataChannel.addEventListener('error', handleErrorEvent);
            this._dataChannel.addEventListener('open', handleOpenEvent);
        });
    }

}
