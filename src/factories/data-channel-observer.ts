import { DataChannelObserver } from '../classes/data-channel-observer';
import { IDataChannelObserverFactoryOptions } from '../interfaces';

export class DataChannelObserverFactory {

    public create<T> ({ dataChannel }: IDataChannelObserverFactoryOptions) {
        return new DataChannelObserver<T>({ dataChannel });
    }

}

export const DATA_CHANNEL_OBSERVER_FACTORY_PROVIDER = { deps: [ ], provide: DataChannelObserverFactory };
