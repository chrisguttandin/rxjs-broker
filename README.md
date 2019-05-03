# rxjs-broker

**An RxJS message broker for WebRTC DataChannels and WebSockets.**

[![tests](https://img.shields.io/travis/chrisguttandin/rxjs-broker/master.svg?style=flat-square)](https://travis-ci.org/chrisguttandin/rxjs-broker)
[![dependencies](https://img.shields.io/david/chrisguttandin/rxjs-broker.svg?style=flat-square)](https://www.npmjs.com/package/rxjs-broker)
[![version](https://img.shields.io/npm/v/rxjs-broker.svg?style=flat-square)](https://www.npmjs.com/package/rxjs-broker)

This module is using the power of [RxJS](https://rxjs-dev.firebaseapp.com) to wrap WebSockets or WebRTC DataChannels. It returns a [Subject](https://rxjs-dev.firebaseapp.com/api/index/class/Subject) which can be used with all the operators RxJS provides, but does also have some special functionality.

## Usage

To install `rxjs-broker` via [npm](https://www.npmjs.com/package/rxjs-broker) you can execute the following command.

```shell
npm install rxjs-broker
```

`rxjs-broker` does provide two utility functions: `connect()` and `wrap()`. If you're using ES2015 modules you can import them like that.

```js
import { connect, wrap } from 'rxjs-broker';
```

### connect(url: string): WebSocketSubject

The `connect()` function takes an URL as a parameter and returns a `WebSocketSubject` which extends the `AnonymousSubject` provided by RxJS. It also implements the `IRemoteSubject` interface which adds two additional methods. It gets explained in more detail below.

```js
const webSocketSubject = connect('wss://super-cool-websock.et');
```

### wrap(dataChannel: DataChannel): DataChannelSubject

The `wrap()` function can be used to turn a WebRTC DataChannel into a `DataChannelSubject` which does also extend the `AnonymousSubject` and implements the `IRemoteSubject` interface.

```js
// Let's imagine a variable called dataChannel exists and its value is a WebRTC DataChannel.
const dataChannelSubject = wrap(dataChannel);
```

### IRemoteSubject

As mentioned above the `IRemoteSubject` interface is used to describe the common behavior of the `DataChannelSubject` and the `WebSocketSubject`. In TypeScript it looks like this:

```typescript
interface IRemoteSubject<T> {

    close (): void;

    send (message: T): Promise<void>;

}
```

#### close()

The `close()` method is meant to close the underlying WebSocket or WebRTC DataChannel.

#### send(message): Promise<void>

The `send()` method is basically a supercharged version of `next()`. It will stringify a given JSON message before sending it and returns a `Promise` which resolves when the message is actually on it's way.

### mask(mask, maskableSubject): IRemoteSubject

`rxjs-broker` does also provide another standalone function called `mask()`. It can be imported like that.

```js
import { mask } from 'rxjs-broker';
```

The `mask()` function takes a JSON object which gets used to extract incoming data and to enhance outgoing data. If there is for example a DataChannel which receives two types of message: control messages and measurement messages. They might look somehow like this:

```json
{
    "type": "control",
    "message": {
        "heating": "off"
    }
}
```

```json
{
    "type": "measurement",
    "message": {
        "temperature": "30°"
    }
}
```

In case you are not interested in the messages of type control and only want to receive and send messages of type measurement, you can use `mask()` to achieve exactly that.

```js
const maskedSubject = mask({ type: 'measurement' }, dataChannelSubject);

// The callback will be called with unwrapped messages like { temperature: '30°' }.
maskedSubject.subscribe((message) => {
    // ...
});
```

When you call `next()` or `send()` on the returned `IRemoteSubject` also wraps the message with the provided mask. Considering the example introduced above, the usage of the `send()` method will look like this:

```js
const maskedSubject = mask({ type: 'measurement' }, dataChannelSubject);

// This will send wrapped messages like { type: 'measurement', message: { temperature: '30°' } }.
maskedSubject.send({ temperature: '30°' });
```
