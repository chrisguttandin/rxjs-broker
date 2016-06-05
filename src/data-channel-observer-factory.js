const BUFFERED_AMOUNT_LOW_THRESHOLD = 2048;

class DataChannelObserver {

    constructor ({ dataChannel }) {
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

    next (value) {
        this.send(value);
    }

    async send (message) {
        if (this._dataChannel.readyState === 'open') { // eslint-disable-line no-undef
            if (this._isSupportingBufferedAmountLowThreshold &&
                    this._dataChannel.bufferedAmount > this._dataChannel.bufferedAmountLowThreshold) {
                return new Promise((resolve, reject) => {
                    /* eslint-disable indent */
                    const handleBufferedAmountLowEvent = () => {
                              this._dataChannel.removeEventListener('bufferedamountlow', handleBufferedAmountLowEvent);
                              this._dataChannel.removeEventListener('error', handleErrorEvent);

                              resolve(this.send(message));
                          };
                    const handleErrorEvent = ({ error }) => {
                              this._dataChannel.removeEventListener('bufferedamountlow', handleBufferedAmountLowEvent);
                              this._dataChannel.removeEventListener('error', handleErrorEvent);

                              reject(error);
                          };
                    /* eslint-enable indent */

                    this._dataChannel.addEventListener('bufferedamountlow', handleBufferedAmountLowEvent);
                    this._dataChannel.addEventListener('error', handleErrorEvent);
                });
            }

            return this._dataChannel.send(JSON.stringify(message));
        }

        return new Promise((resolve, reject) => {
            /* eslint-disable indent */
            const handleErrorEvent = ({ error }) => {
                      this._dataChannel.removeEventListener('error', handleErrorEvent);
                      this._dataChannel.removeEventListener('open', handleOpenEvent);

                      reject(error);
                  };
            const handleOpenEvent = () => {
                      this._dataChannel.removeEventListener('error', handleErrorEvent);
                      this._dataChannel.removeEventListener('open', handleOpenEvent);

                      resolve(this.send(message));
                  };
            /* eslint-enable indent */

            this._dataChannel.addEventListener('error', handleErrorEvent);
            this._dataChannel.addEventListener('open', handleOpenEvent);
        });
    }

}

export class DataChannelObserverFactory {

    create ({ dataChannel }) {
        return new DataChannelObserver({ dataChannel });
    }

}
