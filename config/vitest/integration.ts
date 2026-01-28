import { env } from 'node:process';
import { webdriverio } from '@vitest/browser-webdriverio';
import { defineConfig } from 'vitest/config';
import { WebSocketServer } from 'ws';

export default defineConfig({
    plugins: [
        {
            config: () => {
                let webSocketServer: null | WebSocketServer = null;

                return {
                    test: {
                        browser: {
                            commands: {
                                startWebSocketServer: (_: unknown, port: number) => {
                                    webSocketServer = new WebSocketServer({ port });

                                    const promise = new Promise<void>((resolve) => {
                                        if (webSocketServer !== null) {
                                            webSocketServer.on('listening', () => resolve());
                                        }
                                    });

                                    webSocketServer.on('connection', (webSocket) =>
                                        webSocket.on('message', (webSocketMessage) => webSocket.send(webSocketMessage.toString()))
                                    );

                                    return promise;
                                },
                                stopWebSocketServer: () =>
                                    new Promise<void>((resolve, reject) => {
                                        if (webSocketServer === null) {
                                            resolve();
                                        } else {
                                            webSocketServer.close((err) => (err === undefined ? resolve() : reject(err)));

                                            webSocketServer = null;
                                        }
                                    })
                            }
                        }
                    }
                };
            },
            name: 'web-socket-server-commands'
        }
    ],
    test: {
        watch: false,
        browser: {
            enabled: true,
            instances: env.CI
                ? env.TARGET === 'chrome'
                    ? [{ browser: 'chrome', name: 'Chrome', provider: webdriverio() }]
                    : env.TARGET === 'firefox'
                      ? [{ browser: 'firefox', name: 'Firefox', provider: webdriverio() }]
                      : env.TARGET === 'safari'
                        ? [{ browser: 'safari', headless: false, name: 'Safari', provider: webdriverio() }]
                        : []
                : [
                      {
                          browser: 'chrome',
                          name: 'Chrome',
                          provider: webdriverio({
                              capabilities: {
                                  'goog:chromeOptions': {
                                      args: ['--headless']
                                  }
                              }
                          })
                      },
                      {
                          browser: 'chrome',
                          name: 'Chrome Canary',
                          provider: webdriverio({
                              capabilities: {
                                  'goog:chromeOptions': {
                                      args: ['--headless'],
                                      binary: '/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary'
                                  }
                              }
                          })
                      },
                      {
                          name: 'Firefox Developer',
                          browser: 'firefox',
                          provider: webdriverio({
                              capabilities: {
                                  'moz:firefoxOptions': {
                                      args: ['-headless'],
                                      binary: '/Applications/Firefox\ Developer\ Edition.app/Contents/MacOS/firefox'
                                  }
                              }
                          })
                      },
                      {
                          browser: 'firefox',
                          name: 'Firefox',
                          provider: webdriverio({
                              capabilities: {
                                  'moz:firefoxOptions': {
                                      args: ['-headless']
                                  }
                              }
                          })
                      },
                      { browser: 'safari', name: 'Safari', provider: webdriverio() }
                  ]
        },
        dir: 'test/integration/',
        include: ['**/*.js']
    }
});
