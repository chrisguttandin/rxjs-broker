import { Injectable } from '@angular/core';
import { Observer } from 'rxjs/Observer';
import { IDataChannel, IDataChannelObserverFactoryOptions } from '../interfaces';
import { TJsonValue } from '../types';

const BUFFERED_AMOUNT_LOW_THRESHOLD = 2048;

export class DataChannelObserver implements Observer<TJsonValue> {

    private _dataChannel: IDataChannel;

    private _isSupportingBufferedAmountLowThreshold: boolean;

    constructor ({ dataChannel }: IDataChannelObserverFactoryOptions) {
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

    public complete () {
        // This method does nothing because the DataChannel can be closed separately.
    }

    public error (err: Error) {
        throw err;
    }

    public next (value: TJsonValue) {
        this.send(value);
    }

    public send (message: TJsonValue) {
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

                    const handleErrorEvent = ({ error }: ErrorEvent) => {
                        this._dataChannel.removeEventListener('bufferedamountlow', handleBufferedAmountLowEvent);
                        this._dataChannel.removeEventListener('error', handleErrorEvent);

                        reject(error);
                    };

                    this._dataChannel.addEventListener('bufferedamountlow', handleBufferedAmountLowEvent);
                    this._dataChannel.addEventListener('error', handleErrorEvent);
                });
            }

            return Promise.resolve(this._dataChannel.send(JSON.stringify(message)));
        }

        return new Promise((resolve, reject) => {
            const handleErrorEvent = ({ error }: ErrorEvent) => {
                this._dataChannel.removeEventListener('error', handleErrorEvent);
                this._dataChannel.removeEventListener('open', handleOpenEvent); // tslint:disable-line:no-use-before-declare

                reject(error);
            };

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

@Injectable()
export class DataChannelObserverFactory {

    public create ({ dataChannel }: IDataChannelObserverFactoryOptions) {
        return new DataChannelObserver({ dataChannel });
    }

}
