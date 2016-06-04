import { DataChannelObservableFactory } from './data-channel-observable-factory';
import { DataChannelObserverFactory } from './data-channel-observer-factory';
import { Inject } from '@angular/core/src/di/decorators';
import { Subject } from 'rxjs/Subject';
import { filter } from 'rxjs/operator/filter';
import { map } from 'rxjs/operator/map';

class DataChannelSubject extends Subject {

    constructor ({ dataChannel, dataChannelObservableFactory, dataChannelObserverFactory }) {
        var observable = dataChannelObservableFactory.create({ dataChannel }),
            observer = dataChannelObserverFactory.create({ dataChannel });

        super(observer, observable);

        this._dataChannel = dataChannel;
    }

    close () {
        this._dataChannel.close();
    }

    mask (mask) {
        var maskedSubject = this
                ::filter((message) => Object
                    .keys(mask)
                    .every((key) => mask[key] === message[key]))
                ::map(({ message }) => message);

        maskedSubject.next = ((next) => (message) => next.call(this, { ...mask, message: { ...message } }))(this.next);
        maskedSubject.send = ((send) => (message) => send.call(this, { ...mask, message: { ...message } }))(this.send);

        return maskedSubject;
    }

    send (message) {
        if (this.isUnsubscribed) {
            // throw new ObjectUnsubscribedError();
        }

        if (!this.isStopped) {
            this.destination.send(message);
        }
    }

}

export class DataChannelSubjectFactory {

    constructor (dataChannelObservableFactory, dataChannelObserverFactory) {
        this._options = { dataChannelObservableFactory, dataChannelObserverFactory };
    }

    create ({ dataChannel }) {
        return new DataChannelSubject({ ...this._options, dataChannel });
    }

}

DataChannelSubjectFactory.parameters = [ [ new Inject(DataChannelObservableFactory) ], [ new Inject(DataChannelObserverFactory) ] ];
