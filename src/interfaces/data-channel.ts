import { TBinaryType, TDataChannelState, TEventHandler } from '../types';

// @todo This is an extract of @types/webrtc because it can't be used anymore since it causes a conflict with the built-in types.

export interface IDataChannel extends EventTarget {

    binaryType: TBinaryType;

    readonly bufferedAmount: number;

    bufferedAmountLowThreshold: number;

    readonly id: number;

    readonly label: string;

    readonly maxPacketLifeTime: null | number;

    readonly maxRetransmits: null | number;

    readonly negotiated: boolean;

    onbufferedamountlow: TEventHandler;

    onclose: TEventHandler;

    onopen: TEventHandler;

    readonly ordered: boolean;

    readonly protocol: string;

    readonly readyState: TDataChannelState;

    close (): void;

    onerror (event: ErrorEvent): void;

    onmessage (event: MessageEvent): void;

    send (data: string | Blob | ArrayBuffer | ArrayBufferView): void;

}
