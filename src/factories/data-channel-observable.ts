import { DataChannelObservable } from '../classes/data-channel-observable';
import { IDataChannelObservableFactoryOptions } from '../interfaces';

export class DataChannelObservableFactory {

    public create<T> ({ dataChannel }: IDataChannelObservableFactoryOptions) {
        return new DataChannelObservable<T>({ dataChannel });
    }

}

export const DATA_CHANNEL_OBSERVABLE_FACTORY_PROVIDER = { deps: [ ], provide: DataChannelObservableFactory };
