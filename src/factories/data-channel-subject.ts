import { IMaskableSubject } from '../interfaces/maskable-subject';
import { DataChannelObservableFactory } from './data-channel-observable';
import { DataChannelObserverFactory } from './data-channel-observer';
import { MaskedDataChannelSubjectFactory } from './masked-data-channel-subject';
import { Inject, Injectable } from '@angular/core';
import { AnonymousSubject } from 'rxjs/Subject';

export class DataChannelSubject<T> extends AnonymousSubject<T> implements IMaskableSubject {

    private _dataChannel;

    private _maskedDataChannelSubjectFactory;

    constructor ({ dataChannel, dataChannelObservableFactory, dataChannelObserverFactory, maskedDataChannelSubjectFactory }) {
        const observable = dataChannelObservableFactory.create({ dataChannel });

        const observer = dataChannelObserverFactory.create({ dataChannel });

        super(observer, observable);

        this._dataChannel = dataChannel;
        this._maskedDataChannelSubjectFactory = maskedDataChannelSubjectFactory;
    }

    public close () {
        this._dataChannel.close();
    }

    public mask (mask) {
        return this._maskedDataChannelSubjectFactory.create({ dataChannelSubject: this, mask });
    }

    public send (message) {
        const { destination }: any = this;

        if (!this.isStopped) {
            return destination.send(message);
        }
    }

}

@Injectable()
export class DataChannelSubjectFactory {

    private _options;

    constructor (
        @Inject(DataChannelObservableFactory) dataChannelObservableFactory,
        @Inject(DataChannelObserverFactory) dataChannelObserverFactory,
        @Inject(MaskedDataChannelSubjectFactory) maskedDataChannelSubjectFactory
    ) {
        this._options = { dataChannelObservableFactory, dataChannelObserverFactory, maskedDataChannelSubjectFactory };
    }

    public create ({ dataChannel }): IMaskableSubject {
        return new DataChannelSubject(Object.assign({}, this._options, { dataChannel }));
    }

}
