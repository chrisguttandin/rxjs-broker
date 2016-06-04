class DataChannelObserver {

    constructor ({ dataChannel }) {
        this._dataChannel = dataChannel;
    }

    next (value) {
        this.send(value);
    }

    async send (message) {
        message = JSON.stringify(message);

        if (this._dataChannel.readyState === 'open') { // eslint-disable-line no-undef
            return this._dataChannel.send(message);
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

                      resolve(this._dataChannel.send(message));
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
